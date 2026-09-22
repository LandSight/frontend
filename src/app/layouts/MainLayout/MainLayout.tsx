import React from 'react';

import { cn } from '#/shared/lib/bem';
import { NotificationStack } from '#/shared/ui/notification';

import { WorkspaceHeader } from '../WorkspaceHeader';

import './MainLayout.scss';

const cnMainLayout = cn('MainLayout');

export interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={cnMainLayout()}>
      <WorkspaceHeader />
      <div className={cnMainLayout('Content')}>{React.Children.toArray(children)}</div>
      <NotificationStack />
    </div>
  );
};
