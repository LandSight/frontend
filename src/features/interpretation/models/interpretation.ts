import { action, atom, withAsyncData } from '@reatom/core';

import { getApiErrorMessage } from '#/shared/api/errors';
import { addNotification } from '#/shared/ui/notification';

import * as interpretationApi from '../api/interpretationApi';
import type { InterpretationReport, InterpretationStatus } from '../types';

// === Atoms ===
export const interpretationAtom = atom<InterpretationReport | null>(null, 'interpretationAtom');
export const interpretationStatusAtom = atom<InterpretationStatus | null>(
  null,
  'interpretationStatusAtom'
);

export type InterpretationProgress = { done: number; total: number };

// Texts generated so far while the report is running; null until it starts.
export const interpretationProgressAtom = atom<InterpretationProgress | null>(
  null,
  'interpretationProgressAtom'
);

// Generation takes minutes, but the worker reports its progress after every
// text, so poll often enough for the progress ring to move. If neither the
// status nor the progress changes for this long, the task was most likely lost
// (e.g. the worker restarted mid-run) and the UI offers a manual retry.
const INTERPRETATION_POLL_INTERVAL_MS = 5_000;
const INTERPRETATION_STALE_MS = 15 * 60 * 1000;

// Statuses after which the report no longer changes on its own.
const TERMINAL_STATUSES: ReadonlySet<InterpretationStatus> = new Set([
  'completed',
  'failed',
  'cancelled',
]);

// Guards against a slow poll of a previously selected analysis overwriting the
// report of the analysis the user is looking at now.
const activeInterpretationIdAtom = atom<string | null>(null, 'activeInterpretationIdAtom');

export const resetInterpretation = action(() => {
  activeInterpretationIdAtom.set(null);
  interpretationAtom.set(null);
  interpretationStatusAtom.set(null);
  interpretationProgressAtom.set(null);
}, 'resetInterpretation');

export const fetchInterpretation = action(async (analysisId: string) => {
  activeInterpretationIdAtom.set(analysisId);
  interpretationAtom.set(null);
  interpretationStatusAtom.set(null);
  interpretationProgressAtom.set(null);

  // A short run of 404s is expected right after an analysis completes while the
  // outbox is still relaying the evaluated event; after that the report was
  // never ordered and the UI offers a manual "Generate report" action.
  let notFoundCount = 0;
  const MAX_NOT_FOUND = 6;
  let lastChangeAt: number | null = null;
  let lastState: string | null = null;

  const load = async (): Promise<boolean> => {
    try {
      const report = await interpretationApi.getInterpretation(analysisId);
      if (activeInterpretationIdAtom() !== analysisId) {
        return true;
      }
      interpretationStatusAtom.set(report.status);
      interpretationProgressAtom.set(
        report.progress_total > 0
          ? { done: report.progress_done, total: report.progress_total }
          : null
      );
      if (report.status === 'completed') {
        interpretationAtom.set(report);
        return true;
      }
      if (TERMINAL_STATUSES.has(report.status)) {
        return true;
      }
      const state = `${report.status}:${report.progress_done}`;
      if (state !== lastState) {
        lastState = state;
        lastChangeAt = Date.now();
      } else if (lastChangeAt !== null && Date.now() - lastChangeAt > INTERPRETATION_STALE_MS) {
        // No progress for a long time: the generation was likely lost. Reset the
        // status so the UI offers "Generate report" again.
        interpretationStatusAtom.set(null);
        interpretationProgressAtom.set(null);
        return true;
      }
      return false;
    } catch (error) {
      // A 404 means the report was never ordered: generation has not started,
      // so the UI offers a manual "Generate report" action.
      const status = (error as { response?: { status?: number } } | null)?.response?.status;
      if (status === 404) {
        notFoundCount += 1;
        if (notFoundCount >= MAX_NOT_FOUND) {
          interpretationStatusAtom.set(null);
          return true;
        }
        return false;
      }
      throw error;
    }
  };

  if (await load()) {
    return;
  }

  for (;;) {
    await new Promise((resolve) => setTimeout(resolve, INTERPRETATION_POLL_INTERVAL_MS));
    if (activeInterpretationIdAtom() !== analysisId) {
      return;
    }
    if (await load()) {
      return;
    }
  }
}, 'fetchInterpretation').extend(
  withAsyncData({
    status: true,
    parseError: (error) => {
      const msg = getApiErrorMessage(error, 'Failed to fetch the interpretation report');
      addNotification(msg, 'error');
      return new Error(msg);
    },
  })
);

export const generateReport = action(async (analysisId: string) => {
  // Ordering returns 202 with the "ordered" status; the actual generation runs
  // in the worker, so start polling for the fresh report.
  await interpretationApi.generateReport(analysisId);
  addNotification('The report will be generated automatically', 'success');
  return fetchInterpretation(analysisId);
}, 'generateReport').extend(
  withAsyncData({
    status: true,
    parseError: (error) => {
      const msg = getApiErrorMessage(error, 'Failed to order the interpretation report');
      addNotification(msg, 'error');
      return new Error(msg);
    },
  })
);

export const cancelReport = action(async (analysisId: string) => {
  // The worker stops at its next step; the report is cancelled at once, so the
  // UI switches to the cancelled state without waiting for the next poll, and
  // the running poll loop stops when it reads the terminal status.
  const report = await interpretationApi.cancelReport(analysisId);
  if (activeInterpretationIdAtom() === analysisId) {
    interpretationStatusAtom.set(report.status);
    interpretationProgressAtom.set(null);
  }
  return report;
}, 'cancelReport').extend(
  withAsyncData({
    status: true,
    parseError: (error) => {
      const msg = getApiErrorMessage(error, 'Failed to cancel the report generation');
      addNotification(msg, 'error');
      return new Error(msg);
    },
  })
);
