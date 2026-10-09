import { Paper } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import type { ClusterScore } from '#/features/analyses/types';
import { cn } from '#/shared/lib/bem';

import { ClusterContent } from '../ClusterContent';
import { ClusterHeader } from '../ClusterHeader';

import './ClusterCard.scss';

const cnClusterCard = cn('ClusterCard');

export interface ClusterCardProps {
  cluster: ClusterScore;
}

export const ClusterCard = reatomComponent<ClusterCardProps>(
  ({ cluster }) => (
    <Paper variant="outlined" className={cnClusterCard()}>
      <ClusterHeader cluster={cluster} />
      <ClusterContent cluster={cluster} />
    </Paper>
  ),
  'ClusterCard'
);
