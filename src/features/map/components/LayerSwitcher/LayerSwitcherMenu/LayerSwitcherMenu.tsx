import React from 'react';
import MapIcon from '@mui/icons-material/Map';
import SatelliteIcon from '@mui/icons-material/Satellite';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';

import { cn } from '#/shared/lib/bem';

const cnLayerSwitcherMenu = cn('LayerSwitcherMenu');

interface LayerSwitcherMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  layer: 'osm' | 'satellite';
  onSelect: (newLayer: 'osm' | 'satellite') => void;
}

const LayerSwitcherMenu: React.FC<LayerSwitcherMenuProps> = ({
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
      <MenuItem selected={layer === 'osm'} onClick={() => onSelect('osm')}>
        <ListItemIcon>
          <MapIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Схема</ListItemText>
      </MenuItem>
      <MenuItem selected={layer === 'satellite'} onClick={() => onSelect('satellite')}>
        <ListItemIcon>
          <SatelliteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Спутник</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default LayerSwitcherMenu;
