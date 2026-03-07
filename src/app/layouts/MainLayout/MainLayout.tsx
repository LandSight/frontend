import React from 'react';
import { Outlet } from 'react-router-dom';

import { Sidebar } from '#/features/ui';
import { cn } from '#/shared/lib/bem';

import './MainLayout.scss';

const cnMainLayout = cn('MainLayout');
const MainLayout: React.FC = () => {
  return (
    <div className={cnMainLayout()}>
      <Sidebar />
      <div className={cnMainLayout('Content')}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
