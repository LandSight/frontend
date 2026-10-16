import { abortVar, action } from '@reatom/core';

import apiClient from '#/shared/api/client';

import type { InterpretationReport } from '../types';

export const getInterpretation = action(async (id: string): Promise<InterpretationReport> => {
  const controller = new AbortController();
  abortVar.subscribe(() => controller.abort());
  const response = await apiClient.get<InterpretationReport>(`/analysis/${id}/interpretation`, {
    signal: controller.signal,
  });
  return response.data;
}, 'getInterpretation');

export const generateReport = action(async (id: string): Promise<InterpretationReport> => {
  const controller = new AbortController();
  abortVar.subscribe(() => controller.abort());
  const response = await apiClient.post<InterpretationReport>(
    `/analysis/${id}/interpretation`,
    {},
    { signal: controller.signal }
  );
  return response.data;
}, 'generateReport');

export const cancelReport = action(async (id: string): Promise<InterpretationReport> => {
  const controller = new AbortController();
  abortVar.subscribe(() => controller.abort());
  const response = await apiClient.post<InterpretationReport>(
    `/analysis/${id}/interpretation/cancel`,
    {},
    { signal: controller.signal }
  );
  return response.data;
}, 'cancelReport');
