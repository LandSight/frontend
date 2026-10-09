import { reatomComponent } from '@reatom/react';

import type { ClusterScore } from '#/features/analyses/types';
import { cn } from '#/shared/lib/bem';

import { ClusterHeader } from '../ClusterHeader';
import { ClusterMetricsGrid } from '../ClusterMetricsGrid';

import './ClusterContent.scss';

const cnClusterContent = cn('ClusterContent');

export interface ClusterContentProps {
  cluster: ClusterScore;
}

/** Subclusters as nested sections with their own metrics, then the cluster's own metrics. */
export const ClusterContent = reatomComponent<ClusterContentProps>(
  ({ cluster }) => (
    <>
      {cluster.subclusters.map((subcluster) => (
        <section key={subcluster.key} className={cnClusterContent('Subcluster')}>
          <ClusterHeader cluster={subcluster} nested />
          <ClusterContent cluster={subcluster} />
        </section>
      ))}
      {cluster.metrics.length > 0 && <ClusterMetricsGrid metrics={cluster.metrics} />}
    </>
  ),
  'ClusterContent'
);
