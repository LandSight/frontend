import React from 'react';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MapIcon from '@mui/icons-material/Map';

import { MapPage } from '#/pages/MapPage';

export type RouteConfig = {
  path: string;
  component: React.ComponentType;
  name: string;
  icon?: React.ReactNode;
  exact?: boolean;
  showInMenu?: boolean;
  text?: string;
};

export const routes: RouteConfig[] = [
  {
    path: '/map',
    component: MapPage,
    name: 'Map',
    text: 'Map',
    icon: <MapIcon />,
    exact: true,
    showInMenu: true,
  },
  {
    path: '/analyses',
    component: MapPage,
    name: 'Analysis',
    text: 'Analysis',
    icon: <AssessmentIcon />,
    exact: true,
    showInMenu: true,
  },
  {
    path: '/reports/:id',
    component: MapPage,
    name: 'Report details',
    showInMenu: false,
  },
];

export const defaultRoute = '/map';
