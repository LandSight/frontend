import React from 'react';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';

import { layerConfigs } from '#/features/map/constants.ts';
import { layerTypes } from '#/features/map/types';
import { cn } from '#/shared/lib/bem';

import { layerIcons } from './constants.tsx';
import type { LayerSwitcherMenuProps } from './types';

const cnLayerSwitcherMenu = cn('LayerSwitcherMenu');

export const LayerSwitcherMenu: React.FC<LayerSwitcherMenuProps> = ({
  anchorEl,
  open,
  onClose,
  layer,
  onSelect,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      className={cnLayerSwitcherMenu()}
    >
      {layerTypes.map((layerType) => (
        <MenuItem
          key={layerType}
          selected={layer === layerType}
          onClick={() => onSelect(layerType)}
        >
          <ListItemIcon>{layerIcons[layerType]}</ListItemIcon>
          <ListItemText>{layerConfigs[layerType].label}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
  );
};
