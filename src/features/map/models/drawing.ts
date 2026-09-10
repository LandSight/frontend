import { action, atom, withActions } from '@reatom/core';

import type { Point } from '#/shared/types/geometry';

export const drawingPolygonAtom = atom<Point[] | null>(null, 'drawingPolygonAtom');
export const isDrawingAtom = atom(false, 'isDrawingAtom').extend(
  withActions((target) => ({
    toggle: () => {
      const next = !target();
      target.set(next);
    },
  }))
);

export const setDrawingPolygon = action((points: Point[] | null) => {
  drawingPolygonAtom.set(points);
});

// === Actions ===
export const clearDrawingState = action(() => {
  drawingPolygonAtom.set(null);
  isDrawingAtom.set(false);
});
