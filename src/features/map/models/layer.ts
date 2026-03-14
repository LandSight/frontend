import { atom } from '@reatom/core';

import { type LayerType, layerTypeDefault } from '../types';

export const layerAtom = atom<LayerType>(layerTypeDefault);
