import type { AnalysisType } from '#/features/analysis/types';
import apiClient from '#/shared/api/client';

export type CreateAnalysisRequest = {
  type: AnalysisType;
  parcel_id: string;
};

export type CreateAnalysisResponse = {
  id: string;
  status: string;
};

export const analysisApi = {
  create: async (data: CreateAnalysisRequest): Promise<CreateAnalysisResponse> => {
    const response = await apiClient.post('/analyses', data);
    return response.data;
  },
};
