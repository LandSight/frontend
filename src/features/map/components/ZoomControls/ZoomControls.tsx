import React from 'react';
import { useMap } from 'react-leaflet';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IconButton, Tooltip } from '@mui/material';

import { cn } from '#/shared/lib/bem';

import './ZoomControls.scss';

const cnZoomControls = cn('ZoomControls');

export const ZoomControls: React.FC = () => {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <div className={cnZoomControls()}>
      <Tooltip title="Zoom in" placement="left">
        <IconButton size="medium" onClick={handleZoomIn} className={cnZoomControls('Button')}>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Zoom out" placement="left">
        <IconButton size="medium" onClick={handleZoomOut} className={cnZoomControls('Button')}>
          <RemoveIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};
