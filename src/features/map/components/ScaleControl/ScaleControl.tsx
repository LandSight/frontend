import { effect } from '@reatom/core';
import { reatomFactoryComponent } from '@reatom/react';
import L from 'leaflet';

import { mapInstanceAtom } from '#/features/map/models';

export const ScaleControl = reatomFactoryComponent(() => {
  let control: L.Control.Scale | null = null;

  effect(() => {
    const map = mapInstanceAtom();
    control?.remove();
    control = null;
    if (!map) {
      return;
    }
    control = L.control.scale({ metric: true, imperial: false, position: 'bottomleft' });
    control.addTo(map);
  });

  return () => null;
}, 'ScaleControl');
