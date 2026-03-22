import type { Analysis } from '#/features/analyses/types';
import apiClient from '#/shared/api/client';

export type CreateAnalysisRequest = {
  name: string;
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
  name?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
};

export const analysesApi = {
  start: async (data: CreateAnalysisRequest): Promise<CreateAnalysisResponse> => {
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
