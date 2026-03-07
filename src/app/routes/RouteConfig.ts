import React from 'react';

import MapPage from '#/pages/MapPage/MapPage';

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  name: string;
  icon?: React.ReactNode;
  exact?: boolean;
}

export const routes: RouteConfig[] = [
  { path: '/map', component: MapPage, name: 'Карта', exact: true },
  { path: '/analyses', component: MapPage, name: 'Анализы', exact: true },
  { path: '/analyses/:id', component: MapPage, name: 'Детали анализа' },
];

export const defaultRoute = '/map';
