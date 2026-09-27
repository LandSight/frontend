import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IconButton, Tooltip } from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import { zoomIn, zoomOut } from '#/features/map/models';
import { cn } from '#/shared/lib/bem';

import './ZoomControls.scss';

const cnZoomControls = cn('ZoomControls');

export const ZoomControls = reatomComponent(
  () => (
    <div className={cnZoomControls()}>
      <Tooltip title="Zoom in" placement="left">
        <IconButton
          size="medium"
          onClick={() => wrap(zoomIn())}
          className={cnZoomControls('Button')}
        >
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Zoom out" placement="left">
        <IconButton
          size="medium"
          onClick={() => wrap(zoomOut())}
          className={cnZoomControls('Button')}
        >
          <RemoveIcon />
        </IconButton>
      </Tooltip>
    </div>
  ),
  'ZoomControls'
);
