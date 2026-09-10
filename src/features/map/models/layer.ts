import { atom, withActions } from '@reatom/core';

import { type LayerType, layerTypeDefault } from '../types';

export const layerAtom = atom<LayerType>(layerTypeDefault);

export const layerMenuAnchorElAtom = atom<HTMLElement | null>(null, 'layerMenuAnchorElAtom');
export const isLayerMenuOpenAtom = atom(false, 'isLayerMenuOpenAtom').extend(
  withActions((target) => ({
    open: () => target.set(true),
    close: () => target.set(false),
  }))
);
