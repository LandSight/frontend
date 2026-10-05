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

const INTERPRETATION_POLL_INTERVAL_MS = 2000;
// Generation takes minutes because the reasoning model answers a dozen or more
// prompts per report, so keep polling while the panel is open. If a non-terminal
// status does not change for this long, the task was most likely lost (e.g. the
// worker restarted mid-run) and the UI offers a manual retry.
const INTERPRETATION_STALE_MS = 15 * 60 * 1000;

// Guards against a slow poll of a previously selected analysis overwriting the
// report of the analysis the user is looking at now.
const activeInterpretationIdAtom = atom<string | null>(null, 'activeInterpretationIdAtom');

export const resetInterpretation = action(() => {
  activeInterpretationIdAtom.set(null);
  interpretationAtom.set(null);
  interpretationStatusAtom.set(null);
}, 'resetInterpretation');

export const fetchInterpretation = action(async (analysisId: string) => {
  activeInterpretationIdAtom.set(analysisId);
  interpretationAtom.set(null);
  interpretationStatusAtom.set(null);

  // A short run of 404s is expected right after an analysis completes while the
  // outbox is still relaying the evaluated event; after that the report was
  // never ordered and the UI offers a manual "Generate report" action.
  let notFoundCount = 0;
  const MAX_NOT_FOUND = 6;
  let nonTerminalSince: number | null = null;

  const load = async (): Promise<boolean> => {
    try {
      const report = await interpretationApi.getInterpretation(analysisId);
      if (activeInterpretationIdAtom() !== analysisId) {
        return true;
      }
      interpretationStatusAtom.set(report.status);
      if (report.status === 'completed') {
        interpretationAtom.set(report);
        return true;
      }
      if (nonTerminalSince === null) {
        nonTerminalSince = Date.now();
      } else if (Date.now() - nonTerminalSince > INTERPRETATION_STALE_MS) {
        // No progress for a long time: the generation was likely lost. Reset the
        // status so the UI offers "Generate report" again.
        interpretationStatusAtom.set(null);
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
  addNotification('Отчёт будет сгенерирован автоматически', 'success');
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
