import type { LayerType } from '#/features/map/types';

export type LayerSwitcherProps = {
  layer: LayerType;
  onLayerChange: (newLayer: LayerType) => void;
};
