import { CircularProgress } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import { cn } from '#/shared/lib/bem';

import './ScoreGauge.scss';

const cnScoreGauge = cn('ScoreGauge');

export interface ScoreGaugeProps {
  value: number;
  max: number;
  size?: number;
  className?: string;
}

const formatScale = (value: number): string =>
  Number.isInteger(value) ? String(value) : value.toFixed(2);

/**
 * A ring filled by the share of `value` in `max`, with the value in the middle.
 * The ring takes the current text colour, so callers tint it with `color`.
 */
export const ScoreGauge = reatomComponent<ScoreGaugeProps>(
  ({ value, max, size = 64, className }) => {
    const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

    return (
      <div className={cnScoreGauge(null, [className])}>
        <CircularProgress
          variant="determinate"
          value={percent}
          size={size}
          thickness={4}
          color="inherit"
          enableTrackSlot
        />
        <div className={cnScoreGauge('Text')}>
          <span className={cnScoreGauge('Value')}>{value.toFixed(2)}</span>
          <span className={cnScoreGauge('Scale')}>of {formatScale(max)}</span>
        </div>
      </div>
    );
  },
  'ScoreGauge'
);
