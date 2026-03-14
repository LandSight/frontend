import type { Point } from '#/shared/types/geometry';

export const computeCentroid = (points: Point[]): [number, number] => {
  if (points.length === 0) return [59.93, 30.31];
  const sumLat = points.reduce((acc, p) => acc + p.lat, 0);
  const sumLng = points.reduce((acc, p) => acc + p.lng, 0);
  return [sumLat / points.length, sumLng / points.length];
};

export const getParcelStyle = (
  parcelId: string,
  selectedId: string | null,
  isDrawing: boolean
): {
  color: string;
  weight: number;
  fillOpacity: number;
  opacity: number;
} => {
  const isSelected = parcelId === selectedId;
  const baseOpacity = isDrawing ? 0.3 : 0.6;
  const baseFillOpacity = isDrawing ? 0.1 : 0.2;
  return {
    color: isSelected ? '#2196f3' : '#a32727',
    weight: isSelected ? 3 : 2,
    fillOpacity: isSelected ? (isDrawing ? 0.15 : 0.3) : baseFillOpacity,
    opacity: isSelected ? (isDrawing ? 0.5 : 0.9) : baseOpacity,
  };
};
