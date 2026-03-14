import type { Analysis, AnalysisType } from '#/features/analysis/types';
import apiClient from '#/shared/api/client';

export type CreateAnalysisRequest = {
  type: AnalysisType;
  parcel_id: string;
};

export type CreateAnalysisResponse = {
  id: string;
  status: string;
};

export type FetchAnalysesParams = {
  limit?: number;
  offset?: number;
  search?: string;
  type?: AnalysisType;
  sortBy?: string;
  order?: 'asc' | 'desc';
};

export const analysisApi = {
  create: async (data: CreateAnalysisRequest): Promise<CreateAnalysisResponse> => {
    const response = await apiClient.post('/analyses', data);
    return response.data;
  },

  fetchAll: async (params?: FetchAnalysesParams): Promise<Analysis[]> => {
    const response = await apiClient.get('/analyses', { params });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/analyses/${id}`);
  },

  exportMetrics: async (id: string, format: 'json' | 'csv' = 'json'): Promise<Blob> => {
    const response = await apiClient.get(`/analyses/${id}/metrics`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },
};
