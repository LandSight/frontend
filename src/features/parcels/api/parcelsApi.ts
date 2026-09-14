import { abortVar, action } from '@reatom/core';

import apiClient from '#/shared/api/client';
import type { Point } from '#/shared/types/geometry';
import type { Parcel } from '#/shared/types/parcel';

// === Backend GeoJSON contract ===
export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: number[][][]; // rings of [longitude, latitude]
}

export interface ParcelFeatureProperties {
  id: string;
  name: string;
  owner_id: string;
}

export interface ParcelFeature {
  type: 'Feature';
  geometry: GeoJSONPolygon;
  properties: ParcelFeatureProperties;
}

export interface ParcelFeatureCollection {
  type: 'FeatureCollection';
  features: ParcelFeature[];
  total: number;
}

export interface CreateParcelRequest {
  polygon: Point[];
  name: string;
}

export type CreateParcelResponse = Parcel;

// Converts a GeoJSON Polygon (rings of [lng, lat]) into the internal
// Point[] representation ({ lat, lng }). The trailing closing coordinate
// (which duplicates the first one) is dropped.
const polygonToPoints = (polygon: GeoJSONPolygon): Point[] => {
  const ring = polygon.coordinates[0] ?? [];
  const points = ring.map(([lng, lat]) => ({ lat, lng }));
  if (points.length > 1) {
    const first = points[0];
    const last = points[points.length - 1];
    if (first.lat === last.lat && first.lng === last.lng) {
      points.pop();
    }
  }
  return points;
};

// Converts the internal Point[] into a closed GeoJSON Polygon ring.
const pointsToPolygon = (points: Point[]): GeoJSONPolygon => {
  const ring = points.map((p) => [p.lng, p.lat]);
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first && (!last || last[0] !== first[0] || last[1] !== first[1])) {
    ring.push(first);
  }
  return { type: 'Polygon', coordinates: [ring] };
};

const featureToParcel = (feature: ParcelFeature): Parcel => ({
  id: feature.properties.id,
  name: feature.properties.name,
  owner_id: feature.properties.owner_id,
  polygon: polygonToPoints(feature.geometry),
});

export const getAllParcels = action(async (): Promise<Parcel[]> => {
  const controller = new AbortController();
  abortVar.subscribe(() => controller.abort());
  const response = await apiClient.get<ParcelFeatureCollection>('/parcels/', {
    signal: controller.signal,
  });
  return response.data.features.map(featureToParcel);
}, 'fetchAll');

export const createParcel = action(
  async (data: CreateParcelRequest): Promise<CreateParcelResponse> => {
    const controller = new AbortController();
    abortVar.subscribe(() => controller.abort());
    const response = await apiClient.post<ParcelFeature>('/parcels/', {
      name: data.name,
      polygon: pointsToPolygon(data.polygon),
      signal: controller.signal,
    });
    return featureToParcel(response.data);
  },
  'create'
);

export const deleteParcel = action(async (id: string): Promise<void> => {
  const controller = new AbortController();
  abortVar.subscribe(() => controller.abort());
  await apiClient.delete(`/parcels/${id}`, { signal: controller.signal });
}, 'delete');
