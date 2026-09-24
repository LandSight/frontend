import type React from 'react';
import { AccountTree as HierarchyIcon, ViewList as ListIcon } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import { cn } from '#/shared/lib/bem';

import { setWorkspaceView, type WorkspaceView, workspaceViewAtom } from '../../models';

import './ViewSwitcher.scss';

const cnViewSwitcher = cn('ViewSwitcher');

const viewOptions: { value: WorkspaceView; label: string; icon: React.ReactNode }[] = [
  { value: 'parcels', label: 'Parcels', icon: <HierarchyIcon fontSize="small" /> },
  { value: 'analyses', label: 'Analyses', icon: <ListIcon fontSize="small" /> },
];

export const ViewSwitcher = reatomComponent(() => {
  const view = workspaceViewAtom();

  return (
    <Box className={cnViewSwitcher()}>
      {viewOptions.map((option) => (
        <Button
          key={option.value}
          size="small"
          disableRipple
          startIcon={option.icon}
          onClick={() => wrap(setWorkspaceView(option.value))}
          className={cnViewSwitcher('Button', { active: view === option.value })}
        >
          {option.label}
        </Button>
      ))}
    </Box>
  );
}, 'ViewSwitcher');
