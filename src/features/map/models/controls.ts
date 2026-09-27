import { action } from '@reatom/core';

import { mapInstanceAtom } from './mapInstance';

export const zoomIn = action(() => {
  mapInstanceAtom()?.zoomIn();
}, 'zoomIn');

export const zoomOut = action(() => {
  mapInstanceAtom()?.zoomOut();
}, 'zoomOut');
