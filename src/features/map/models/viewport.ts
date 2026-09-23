import { atom } from '@reatom/core';

export type MapViewState = {
  center: { lat: number; lng: number };
  zoom: number;
};

export const mapViewAtom = atom<MapViewState | null>(null, 'mapViewAtom');
