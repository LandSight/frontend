import React from 'react';
import { reatomRoute } from '@reatom/core';

import { AuthLayout } from '#/app/layouts/AuthLayout';
import { MainLayout } from '#/app/layouts/MainLayout';
import { userAtom } from '#/features/auth';
import { LoginPage } from '#/pages/LoginPage';
import { RegisterPage } from '#/pages/RegisterPage';
import { WorkspacePage } from '#/pages/WorkspacePage';

export const rootLayout = reatomRoute({
  layout: true,
  render: (self) => <>{React.Children.toArray(self.outlet())}</>,
});

export const loginRoute = rootLayout.reatomRoute({
  path: 'login',
  params() {
    if (userAtom()) {
      workspaceRoute.go();
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
      workspaceRoute.go();
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
  render: (self) => <MainLayout>{React.Children.toArray(self.outlet())}</MainLayout>,
});

export const workspaceRoute = protectedLayout.reatomRoute({
  path: '',
  render: () => <WorkspacePage />,
});
