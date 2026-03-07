import apiClient from '#/shared/api/client';
import type { AnalysisType } from '#/shared/types/analysis';
import type { Point } from '#/shared/types/geometry';

export interface CreateAnalysisRequest {
  name: string;
  type: AnalysisType;
  polygon: Point[];
}

export interface CreateAnalysisResponse {
  id: string;
  status: string;
}

export const analysisApi = {
  create: async (data: CreateAnalysisRequest): Promise<CreateAnalysisResponse> => {
    const response = await apiClient.post('/analyses', data);
    return response.data;
  },
};
