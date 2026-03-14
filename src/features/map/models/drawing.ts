import { action, atom } from '@reatom/core';

import type { Point } from '#/shared/types/geometry';

export const drawingPolygonAtom = atom<Point[] | null>(null);
export const isDrawingAtom = atom(false);

export const setDrawingPolygon = action((points: Point[] | null) => {
  drawingPolygonAtom.set(points);
});

export const setIsDrawing = action((enabled: boolean) => {
  isDrawingAtom.set(enabled);
});

export const clearDrawingState = action(() => {
  drawingPolygonAtom.set(null);
  isDrawingAtom.set(false);
});
