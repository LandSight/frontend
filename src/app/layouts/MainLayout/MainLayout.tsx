import React from 'react';
import { Outlet } from 'react-router-dom';

import { cn } from '#/shared/lib/bem';
import { NotificationStack } from '#/shared/ui/notification';

import { Sidebar } from '../Sidebar';

import './MainLayout.scss';

const cnMainLayout = cn('MainLayout');
const MainLayout: React.FC = () => {
  return (
    <div className={cnMainLayout()}>
      <Sidebar />
      <div className={cnMainLayout('Content')}>
        <Outlet />
      </div>
      <NotificationStack />
    </div>
  );
};

export default MainLayout;
