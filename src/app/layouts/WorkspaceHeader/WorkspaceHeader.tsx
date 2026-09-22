import type React from 'react';
import {
  AccountTree as HierarchyIcon,
  Logout as LogoutIcon,
  ViewList as ListIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import { currentUsernameAtom, logout } from '#/features/auth';
import {
  setWorkspaceView,
  type WorkspaceView,
  workspaceViewAtom,
} from '#/features/workspace/models';
import { cn } from '#/shared/lib/bem';

import './WorkspaceHeader.scss';

const cnWorkspaceHeader = cn('WorkspaceHeader');

const viewOptions: { value: WorkspaceView; label: string; icon: React.ReactNode }[] = [
  { value: 'parcels', label: 'Parcels', icon: <HierarchyIcon fontSize="small" /> },
  { value: 'analyses', label: 'Analyses', icon: <ListIcon fontSize="small" /> },
];

export const WorkspaceHeader = reatomComponent(() => {
  const view = workspaceViewAtom();
  const username = currentUsernameAtom();
  const initials = (username ?? 'LS').slice(0, 2).toUpperCase();

  return (
    <AppBar position="static" elevation={0} className={cnWorkspaceHeader()}>
      <Toolbar sx={{ gap: 1, py: 1 }}>
        <img src="/logo.png" alt="LandSight Logo" className={cnWorkspaceHeader('Logo')} />
        <Typography variant="h5" className={cnWorkspaceHeader('Title')}>
          LandSight
        </Typography>

        <Box sx={{ flex: 1 }} />

        <Box className={cnWorkspaceHeader('ViewSwitch')}>
          {viewOptions.map((option) => (
            <Button
              key={option.value}
              size="small"
              disableRipple
              startIcon={option.icon}
              onClick={() => wrap(setWorkspaceView(option.value))}
              className={cnWorkspaceHeader('ViewSwitchButton', {
                active: view === option.value,
              })}
            >
              {option.label}
            </Button>
          ))}
        </Box>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ ml: 1 }}>
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
