import { action, atom } from '@reatom/core';

import { addNotification } from '#/shared/ui/notification';

import type { CreateAnalysisRequest } from '../api/analysisApi';
import { analysisApi } from '../api/analysisApi';

export const analysisAtom = atom<Record<string, any>>({});
export const isLoadingAtom = atom(false);
export const errorAtom = atom<string | null>(null);

errorAtom.subscribe((error) => {
  if (error) {
    addNotification(error, 'error');
  }
});

export const createAnalysis = action(async (data: CreateAnalysisRequest) => {
  isLoadingAtom.set(true);
  errorAtom.set(null);

  try {
    const newAnalysis = await analysisApi.create(data);
    analysisAtom.set((prev) => ({ ...prev, [newAnalysis.id]: newAnalysis }));
    addNotification('Analysis started successfully', 'success');
    return newAnalysis;
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create analysis';
    errorAtom.set(msg);
    throw err;
  } finally {
    isLoadingAtom.set(false);
  }
});
