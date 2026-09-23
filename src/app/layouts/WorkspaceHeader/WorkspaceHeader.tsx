import { Logout as LogoutIcon } from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { reatomComponent } from '@reatom/react';

import { currentUsernameAtom, logout } from '#/features/auth';
import { cn } from '#/shared/lib/bem';

import './WorkspaceHeader.scss';

const cnWorkspaceHeader = cn('WorkspaceHeader');

export const WorkspaceHeader = reatomComponent(() => {
  const username = currentUsernameAtom();
  const initials = (username ?? 'LS').slice(0, 2).toUpperCase();

  return (
    <AppBar position="static" elevation={0} className={cnWorkspaceHeader()}>
      <Toolbar sx={{ gap: 1.5, py: 1.5 }}>
        <img src="/logo.png" alt="LandSight Logo" className={cnWorkspaceHeader('Logo')} />
        <Typography variant="h6" className={cnWorkspaceHeader('Title')}>
          LandSight
        </Typography>

        <Box sx={{ flex: 1 }} />

        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
            {initials}
          </Avatar>
          <Typography variant="body2" className={cnWorkspaceHeader('Username')} noWrap>
            {username ? `@${username}` : 'Signed in'}
          </Typography>
          <Tooltip title="Logout">
            <IconButton size="small" color="inherit" onClick={logout}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}, 'WorkspaceHeader');
