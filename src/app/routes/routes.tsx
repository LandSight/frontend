import { reatomRoute } from '@reatom/core';

import { AuthLayout } from '#/app/layouts/AuthLayout';
import { MainLayout } from '#/app/layouts/MainLayout';
import { userAtom } from '#/features/auth';
import { AnalysesPage } from '#/pages/AnalysesPage';
import { LoginPage } from '#/pages/LoginPage';
import { MapPage } from '#/pages/MapPage';
import { RegisterPage } from '#/pages/RegisterPage';

export const rootLayout = reatomRoute({
  layout: true,
  render: (self) => self.outlet(),
});

// ----- Корень "/" (гостевая зона): уже авторизован -> в приложение -----
export const loginRoute = rootLayout.reatomRoute({
  path: 'login',
  params() {
    if (userAtom()) {
      mapRoute.go();
      return null;
    }
    return {};
  },
  render: () => (
    <AuthLayout>
      <LoginPage />
    </AuthLayout>
  ),
});

export const registerRoute = rootLayout.reatomRoute({
  path: 'register',
  params() {
    if (userAtom()) {
      mapRoute.go();
      return null;
    }
    return {};
  },
  render: () => (
    <AuthLayout>
      <RegisterPage />
    </AuthLayout>
  ),
});

export const protectedLayout = rootLayout.reatomRoute({
  layout: true,
  params() {
    if (!userAtom()) {
      if (!loginRoute.match() && !registerRoute.match()) {
        loginRoute.go();
      }
      return null;
    }
    return {};
  },
  render: (self) => <MainLayout>{self.outlet()}</MainLayout>,
});

export const mapRoute = protectedLayout.reatomRoute({
  path: 'map',
  render: () => <MapPage />,
});
export const analysesRoute = protectedLayout.reatomRoute({
  path: 'analyses',
  render: () => <AnalysesPage />,
});
