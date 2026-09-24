import { abortVar, action } from '@reatom/core';

import apiClient from '#/shared/api/client';

export type MetricRef = {
  module: string;
  category: string | null;
  metrics_id: string;
};

export type InfrastructureCategory = {
  category: string;
  label: string;
};

export type GeoJsonPoint = { type: 'Point'; coordinates: [number, number] };
export type GeoJsonLineString = { type: 'LineString'; coordinates: [number, number][] };
export type GeoJsonPolygon = { type: 'Polygon'; coordinates: [number, number][][] };
export type GeoJsonGeometry = GeoJsonPoint | GeoJsonLineString | GeoJsonPolygon;

export type InfrastructureObjectProperties = {
  osm_id: string;
  name: string | null;
  category: string;
};

export type InfrastructureObjectFeature = {
  type: 'Feature';
  geometry: GeoJsonGeometry;
  properties: InfrastructureObjectProperties;
};

export type InfrastructureFeatureCollection = {
  type: 'FeatureCollection';
  features: InfrastructureObjectFeature[];
};

export const getAnalysisMetrics = action(
  async (analysisId: string, module = 'infrastructure'): Promise<MetricRef[]> => {
    const controller = new AbortController();
    abortVar.subscribe(() => controller.abort());
    const response = await apiClient.get<MetricRef[]>(`/analysis/${analysisId}/metrics`, {
      params: { module },
      signal: controller.signal,
    });
    return response.data;
  },
  'getAnalysisMetrics'
);

export const getInfrastructureCategories = action(async (): Promise<InfrastructureCategory[]> => {
  const controller = new AbortController();
  abortVar.subscribe(() => controller.abort());
  const response = await apiClient.get<InfrastructureCategory[]>(
    '/infrastructure/metrics/categories',
    {
      signal: controller.signal,
    }
  );
  return response.data;
}, 'getInfrastructureCategories');

export const getInfrastructureObjects = action(
  async (category: string, metricsId: string): Promise<InfrastructureFeatureCollection> => {
    const controller = new AbortController();
    abortVar.subscribe(() => controller.abort());
    const response = await apiClient.get<InfrastructureFeatureCollection>(
      '/infrastructure/objects',
      {
        params: { category, metrics_id: metricsId },
        signal: controller.signal,
      }
    );
    return response.data;
  },
  'getInfrastructureObjects'
);
