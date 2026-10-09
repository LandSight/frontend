import { useState } from 'react';
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { Button, LinearProgress, Paper, Typography } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import {
  formatPercent,
  formatPoints,
  getLossSeverity,
  toPercent,
} from '#/features/interpretation/helpers';
import type { AspectInterpretation } from '#/features/interpretation/types';
import { cn } from '#/shared/lib/bem';

import { MetricsGrid } from '../MetricsGrid';

import './AspectCard.scss';

const cnAspectCard = cn('AspectCard');

export interface AspectCardProps {
  aspect: AspectInterpretation;
}

export const AspectCard = reatomComponent<AspectCardProps>(({ aspect }) => {
  const [showAll, setShowAll] = useState(false);
  const canShowAll = aspect.metrics.length > aspect.top_metrics.length;
  const metrics = showAll && canShowAll ? aspect.metrics : aspect.top_metrics;

  return (
    <Paper variant="outlined" className={cnAspectCard()}>
      <div className={cnAspectCard('Header')}>
        <span className={cnAspectCard('Name')}>{aspect.name || aspect.key}</span>
        {aspect.loss > 0 && (
          <span className={cnAspectCard('Loss')} data-severity={getLossSeverity(aspect.loss_share)}>
            <TrendingDownIcon fontSize="inherit" />
            {formatPoints(aspect.loss)} pts lost ({formatPercent(aspect.loss_share)})
          </span>
        )}
        <LinearProgress
          variant="determinate"
          value={toPercent(aspect.points, aspect.max_points)}
          className={cnAspectCard('Bar')}
        />
        <span className={cnAspectCard('Score')}>
          {formatPoints(aspect.points)}
          <span className={cnAspectCard('Max')}> / {formatPoints(aspect.max_points)}</span>
        </span>
      </div>

      {aspect.explanation && (
        <Typography variant="body1" className={cnAspectCard('Takeaway')}>
          {aspect.explanation}
        </Typography>
      )}

      {metrics.length > 0 && <MetricsGrid metrics={metrics} className={cnAspectCard('Metrics')} />}

      {canShowAll && (
        <Button
          size="small"
          className={cnAspectCard('Toggle')}
          endIcon={showAll ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? 'Show key metrics' : `Show all ${aspect.metrics.length} metrics`}
        </Button>
      )}
    </Paper>
  );
}, 'AspectCard');
