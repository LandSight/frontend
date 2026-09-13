import { abortVar, action } from '@reatom/core';

import type { Analysis } from '#/features/analyses/types';
import apiClient from '#/shared/api/client';

export type CreateAnalysisRequest = {
  name: string;
  parcel_id: string;
};

export type CreateAnalysisResponse = Analysis;

export const startAnalysis = action(
  async (data: CreateAnalysisRequest): Promise<CreateAnalysisResponse> => {
    const controller = new AbortController();
    abortVar.subscribe(() => controller.abort());
    const response = await apiClient.post<CreateAnalysisResponse>(
      '/analysis',
      {
        parcel_id: data.parcel_id,
        name: data.name,
      },
      { signal: controller.signal }
    );
    return response.data;
  },
  'startAnalysis'
);

export const getAllAnalyses = action(async (): Promise<Analysis[]> => {
  const controller = new AbortController();
  abortVar.subscribe(() => controller.abort());
  const response = await apiClient.get<Analysis[]>('/analysis', {
    signal: controller.signal,
  });
  return response.data;
}, 'getAllAnalyses');

export const getAnalysisById = action(async (id: string): Promise<Analysis> => {
  const controller = new AbortController();
  abortVar.subscribe(() => controller.abort());
  const response = await apiClient.get<Analysis>(`/analysis/${id}`, {
    signal: controller.signal,
  });
  return response.data;
}, 'getAnalysisById');

export const deleteAnalysis = action(async (id: string): Promise<void> => {
  const controller = new AbortController();
  abortVar.subscribe(() => controller.abort());
  await apiClient.delete(`/analysis/${id}`, {
    signal: controller.signal,
  });
}, 'deleteAnalysis');
