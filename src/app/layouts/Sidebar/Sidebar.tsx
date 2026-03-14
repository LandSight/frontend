import React from 'react';
import { Divider } from '@mui/material';

import { cn } from '#/shared/lib/bem';

import { Footer } from './Footer';
import { Header } from './Header';
import { NavigationMenu } from './NavigationMenu';

import './Sidebar.scss';

const cnSidebar = cn('Sidebar');

export const Sidebar: React.FC = () => {
  return (
    <div className={cnSidebar()}>
      <Header />
      <Divider className={cnSidebar('Divider')} />
      <NavigationMenu />
      <Divider className={cnSidebar('Divider')} />
      <Footer />
    </div>
  );
};
