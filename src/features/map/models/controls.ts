import { action, effect } from '@reatom/core';
import L from 'leaflet';

import { mapInstanceAtom } from './mapInstance';

export const zoomIn = action(() => {
  mapInstanceAtom()?.zoomIn();
}, 'zoomIn');

export const zoomOut = action(() => {
  mapInstanceAtom()?.zoomOut();
}, 'zoomOut');

let scaleControl: L.Control.Scale | null = null;

effect(() => {
  const map = mapInstanceAtom();
  scaleControl?.remove();
  scaleControl = null;
  if (!map) {
    return;
  }
  scaleControl = L.control.scale({ metric: true, imperial: false, position: 'bottomleft' });
  scaleControl.addTo(map);
}, 'mapScaleControlEffect');
