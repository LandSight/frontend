import React from 'react';

import { cn } from '#/shared/lib/bem';
import { NotificationStack } from '#/shared/ui/notification';

import { Sidebar } from '../Sidebar';

import './MainLayout.scss';

const cnMainLayout = cn('MainLayout');

export interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={cnMainLayout()}>
      <Sidebar />
      <div className={cnMainLayout('Content')}>{children}</div>
      <NotificationStack />
    </div>
  );
};
