import { Chip } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import { type AnalysisStatus, analysisStatusLabels } from '#/features/analyses/types';
import { cn } from '#/shared/lib/bem';

import './AnalysisStatusChip.scss';

const cnAnalysisStatusChip = cn('AnalysisStatusChip');

const statusColors: Record<AnalysisStatus, string> = {
  pending: '#cfd8dc',
  running: '#4ba6ef',
  completed: '#9bff9f',
  failed: '#e0584e',
};

export interface AnalysisStatusChipProps {
  status: AnalysisStatus;
  variant?: 'filled' | 'outlined';
}

export const AnalysisStatusChip = reatomComponent<AnalysisStatusChipProps>(
  ({ status, variant = 'filled' }) => {
    const color = statusColors[status];

    return (
      <Chip
        label={analysisStatusLabels[status]}
        variant={variant}
        size="small"
        className={cnAnalysisStatusChip()}
        style={
          variant === 'filled'
            ? { backgroundColor: color, color: '#000000' }
            : { borderColor: color, color }
        }
      />
    );
  },
  'AnalysisStatusChip'
);
