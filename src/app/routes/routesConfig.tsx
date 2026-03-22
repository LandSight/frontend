import AssessmentIcon from '@mui/icons-material/Assessment';
import MapIcon from '@mui/icons-material/Map';

import { analysesRoute, mapRoute } from '#/app/routes/routes';
import { AnalysesPage } from '#/pages/AnalysesPage';
import { MapPage } from '#/pages/MapPage';

export const routesConfig = {
  map: {
    route: mapRoute,
    component: MapPage,
    text: 'Map',
    icon: <MapIcon />,
    showInMenu: true,
    exact: true,
  },
  analyses: {
    route: analysesRoute,
    component: AnalysesPage,
    text: 'Analysis',
    icon: <AssessmentIcon />,
    showInMenu: true,
    exact: true,
  },
};
