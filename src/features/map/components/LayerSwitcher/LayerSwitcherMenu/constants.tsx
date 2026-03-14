import React from 'react';
import MapIcon from '@mui/icons-material/Map';
import SatelliteIcon from '@mui/icons-material/Satellite';

import type { LayerType } from '#/features/map/types';

export const layerIcons: Record<LayerType, React.ReactElement> = {
  osm: <MapIcon fontSize="small" />,
  satellite: <SatelliteIcon fontSize="small" />,
};
