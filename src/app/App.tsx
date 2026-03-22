import { ThemeProvider } from '@mui/material/styles';
import { urlAtom } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import { MainLayout } from './layouts/MainLayout';
import { mapRoute } from './routes/routes';
import { routesConfig } from './routes/routesConfig';
import { theme } from './theme';

export const App = reatomComponent(() => {
  const { pathname } = urlAtom();

  if (pathname === '/') {
    mapRoute.go();
  }

  return (
    <ThemeProvider theme={theme}>
      <MainLayout>
        {Object.values(routesConfig).map(({ route, component: Page, exact }) => {
          const active = exact ? route.exact() : route();
          return active ? <Page key={route.name} /> : null;
        })}
      </MainLayout>
    </ThemeProvider>
  );
});
