import { Chip, LinearProgress, Tooltip } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import { formatNumber, formatPercent } from '#/features/analyses/helpers';
import type { ClusterScore } from '#/features/analyses/types';
import { cn } from '#/shared/lib/bem';

import './ClusterHeader.scss';

const cnClusterHeader = cn('ClusterHeader');

export interface ClusterHeaderProps {
  cluster: ClusterScore;
  nested?: boolean;
}

export const ClusterHeader = reatomComponent<ClusterHeaderProps>(
  ({ cluster, nested = false }) => (
    <div className={cnClusterHeader({ nested })}>
      <div className={cnClusterHeader('Title')}>
        <span className={cnClusterHeader('Name')}>{cluster.name || cluster.key}</span>
        <Tooltip title="Share of this group inside its parent." placement="top" arrow>
          <Chip
            size="small"
            variant="outlined"
            label={`Weight ${formatNumber(cluster.weight)}`}
            className={cnClusterHeader('Chip')}
          />
        </Tooltip>
        <Tooltip
          title="Fit × weight: what this group adds to its parent score."
          placement="top"
          arrow
        >
          <Chip
            size="small"
            variant="outlined"
            label={`Contribution ${formatNumber(cluster.contribution)}`}
            className={cnClusterHeader('Chip')}
          />
        </Tooltip>
      </div>
      <LinearProgress
        variant="determinate"
        value={Math.min(100, Math.max(0, cluster.score * 100))}
        className={cnClusterHeader('Bar')}
      />
      <Tooltip title="Weighted fit of the metrics in this group" placement="top" arrow>
        <span className={cnClusterHeader('Score')}>{formatPercent(cluster.score)}</span>
      </Tooltip>
    </div>
  ),
  'ClusterHeader'
);
