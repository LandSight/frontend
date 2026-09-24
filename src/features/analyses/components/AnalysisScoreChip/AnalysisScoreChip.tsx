import { Chip } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import { cn } from '#/shared/lib/bem';

import './AnalysisScoreChip.scss';

const cnAnalysisScoreChip = cn('AnalysisScoreChip');

export interface AnalysisScoreChipProps {
  score: number;
  variant?: 'filled' | 'outlined';
}

export const AnalysisScoreChip = reatomComponent<AnalysisScoreChipProps>(
  ({ score, variant = 'filled' }) => {
    const color = `hsl(${score * 12}, 90%, 45%)`;

    return (
      <Chip
        label={score.toFixed(1)}
        variant={variant}
        size="small"
        className={cnAnalysisScoreChip()}
        style={
          variant === 'filled'
            ? { backgroundColor: color, color: '#000000' }
            : { borderColor: color, color }
        }
      />
    );
  },
  'AnalysisScoreChip'
);
