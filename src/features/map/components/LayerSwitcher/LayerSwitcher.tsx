import React, { useState } from 'react';
import LayersIcon from '@mui/icons-material/Layers';
import { IconButton, Tooltip } from '@mui/material';

import { cn } from '#/shared/lib/bem';

import LayerSwitcherMenu from './LayerSwitcherMenu/LayerSwitcherMenu';

import './LayerSwitcher.scss';

const cnLayerSwitcher = cn('LayerSwitcher');

interface LayerSwitcherProps {
  layer: 'osm' | 'satellite';
  onLayerChange: (newLayer: 'osm' | 'satellite') => void;
}

export const LayerSwitcher: React.FC<LayerSwitcherProps> = ({ layer, onLayerChange }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (newLayer: 'osm' | 'satellite') => {
    onLayerChange(newLayer);
    handleClose();
  };

  return (
    <div className={cnLayerSwitcher()}>
      <Tooltip title="Слои карты" placement="left">
        <IconButton size="medium" onClick={handleClick} className={cnLayerSwitcher('Button')}>
          <LayersIcon />
        </IconButton>
      </Tooltip>
      <LayerSwitcherMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        layer={layer}
        onSelect={handleSelect}
      />
    </div>
  );
};
