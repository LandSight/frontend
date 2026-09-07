import { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { urlAtom } from '@reatom/core';
import { reatomComponent, useAction, useAtom } from '@reatom/react';

import { AuthLayout } from '#/app/layouts/AuthLayout';
import { isAuthenticatedAtom, restoreSession } from '#/features/auth';
import { LoginPage } from '#/pages/LoginPage';
import { RegisterPage } from '#/pages/RegisterPage';

import { MainLayout } from './layouts/MainLayout';
import { loginRoute, mapRoute, registerRoute } from './routes/routes';
import { routesConfig } from './routes/routesConfig';
import { theme } from './theme';

export const App = reatomComponent(() => {
  const { pathname } = urlAtom();
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const handleRestoreSession = useAction(restoreSession);

  useEffect(() => {
    handleRestoreSession();
  }, []);

  const isLogging = loginRoute.exact();
  const isRegistering = registerRoute.exact();

  // Auth pages are always accessible and rendered without the main layout.
  if (isLogging || isRegistering) {
    return (
      <ThemeProvider theme={theme}>
        <AuthLayout>{isRegistering ? <RegisterPage /> : <LoginPage />}</AuthLayout>
      </ThemeProvider>
    );
  }

  // Guard protected pages.
  if (!isAuthenticated) {
    loginRoute.go();
    return null;
  }

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
