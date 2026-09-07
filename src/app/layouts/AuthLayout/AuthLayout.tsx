import React from 'react';
import { Box } from '@mui/material';

import { cn } from '#/shared/lib/bem';
import { NotificationStack } from '#/shared/ui/notification';

import './AuthLayout.scss';

const cnAuthLayout = cn('AuthLayout');

export interface AuthLayoutProps {
  children?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Box className={cnAuthLayout()}>
      {children}
      <NotificationStack />
    </Box>
  );
};
