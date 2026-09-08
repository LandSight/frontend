import { ThemeProvider } from '@mui/material/styles';
import { effect, peek, urlAtom } from '@reatom/core';
import { reatomFactoryComponent } from '@reatom/react';

import { AuthLayout } from '#/app/layouts/AuthLayout';
import { isAuthenticatedAtom, restoreSession } from '#/features/auth';
import { LoginPage } from '#/pages/LoginPage';
import { RegisterPage } from '#/pages/RegisterPage';

import { MainLayout } from './layouts/MainLayout';
import { loginRoute, mapRoute, registerRoute } from './routes/routes';
import { routesConfig } from './routes/routesConfig';
import { theme } from './theme';

export const App = reatomFactoryComponent(() => {
  restoreSession();

  effect(() => {
    const { pathname } = urlAtom();
    if (pathname === '/' && peek(isAuthenticatedAtom)) {
      mapRoute.go();
    }
  });

  return () => {
    if (loginRoute.exact() || registerRoute.exact()) {
      return (
        <ThemeProvider theme={theme}>
          <AuthLayout>{registerRoute.exact() ? <RegisterPage /> : <LoginPage />}</AuthLayout>
        </ThemeProvider>
      );
    }
    if (isAuthenticatedAtom()) {
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
    } else {
      loginRoute.go();
    }
  };
}, 'App');
