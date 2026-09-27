import { action } from '@reatom/core';
import L from 'leaflet';

import { selectedParcelAtom } from '#/features/parcels/models/parcels';
import { toLeafletArray } from '#/shared/types/geometry';

import { mapInstanceAtom } from './mapInstance';

export const focusSelectedParcel = action(() => {
  const map = mapInstanceAtom();
  const parcel = selectedParcelAtom();
  if (!map || !parcel) {
    return;
  }
  const bounds = L.latLngBounds(toLeafletArray(parcel.polygon));
  map.flyToBounds(bounds.pad(1), { animate: true, duration: 1.2, padding: [20, 20] });
}, 'focusSelectedParcel');
