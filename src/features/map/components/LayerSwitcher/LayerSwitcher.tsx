import React, { useState } from 'react';
import LayersIcon from '@mui/icons-material/Layers';
import { IconButton, Tooltip } from '@mui/material';

import type { LayerType } from '#/features/map/types';
import { cn } from '#/shared/lib/bem';

import { LayerSwitcherMenu } from './LayerSwitcherMenu';
import type { LayerSwitcherProps } from './types';

import './LayerSwitcher.scss';

const cnLayerSwitcher = cn('LayerSwitcher');

export const LayerSwitcher: React.FC<LayerSwitcherProps> = ({ layer, onLayerChange }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (newLayer: LayerType) => {
    onLayerChange(newLayer);
    handleClose();
  };

  return (
    <div className={cnLayerSwitcher()}>
      <Tooltip title="Map layers" placement="left">
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
