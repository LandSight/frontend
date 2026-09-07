import React from 'react';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useAction, useAtom } from '@reatom/react';

import { currentUsernameAtom, logout } from '#/features/auth';
import { cn } from '#/shared/lib/bem';

import './Footer.scss';

const cnFooter = cn('Footer');

export const Footer: React.FC = () => {
  const [username] = useAtom(currentUsernameAtom);
  const handleLogout = useAction(logout);

  return (
    <footer className={cnFooter()}>
      <div className={cnFooter('User')}>
        <Typography variant="body2" noWrap className={cnFooter('Username')}>
          {username ? `@${username}` : 'Signed in'}
        </Typography>
        <Button
          variant="text"
          size="small"
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          className={cnFooter('Logout')}
        >
          Logout
        </Button>
      </div>
      <Typography variant="caption" className={cnFooter('Text')}>
        © {new Date().getFullYear()} LandSight - Анализ земельных участков
      </Typography>
    </footer>
  );
};
