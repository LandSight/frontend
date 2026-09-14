import type React from 'react';
import LayersIcon from '@mui/icons-material/Layers';
import { IconButton, Tooltip } from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomFactoryComponent } from '@reatom/react';

import { isLayerMenuOpenAtom, layerAtom, layerMenuAnchorElAtom } from '#/features/map/models';
import type { LayerType } from '#/features/map/types';
import { cn } from '#/shared/lib/bem';

import { LayerSwitcherMenu } from './LayerSwitcherMenu';

import './LayerSwitcher.scss';

const cnLayerSwitcher = cn('LayerSwitcher');

export const LayerSwitcher = reatomFactoryComponent(() => {
  return () => {
    const layer = layerAtom();
    const open = isLayerMenuOpenAtom();
    const anchorEl = layerMenuAnchorElAtom();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      wrap(layerMenuAnchorElAtom.set(event.currentTarget));
      wrap(isLayerMenuOpenAtom.open());
    };

    const handleClose = () => {
      wrap(isLayerMenuOpenAtom.close());
      wrap(layerMenuAnchorElAtom.set(null));
    };

    const handleSelect = (newLayer: LayerType) => {
      wrap(layerAtom.set(newLayer));
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
}, 'LayerSwitcher');
