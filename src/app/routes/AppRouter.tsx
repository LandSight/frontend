import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout/MainLayout';

import { defaultRoute, routes } from './RouteConfig';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to={defaultRoute} replace />} />
          {routes.map(({ path, component: Component, exact }) => (
            <Route key={path} path={path} element={<Component />} {...(exact && { index: true })} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
