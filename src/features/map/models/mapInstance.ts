import { atom } from '@reatom/core';
import type { Map as LeafletMap } from 'leaflet';

export const mapInstanceAtom = atom<LeafletMap | null>(null, 'mapInstanceAtom');
