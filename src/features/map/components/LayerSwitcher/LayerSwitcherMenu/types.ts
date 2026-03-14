import type { LayerType } from '#/features/map/types';

export type LayerSwitcherMenuProps = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  layer: LayerType;
  onSelect: (newLayer: LayerType) => void;
};
