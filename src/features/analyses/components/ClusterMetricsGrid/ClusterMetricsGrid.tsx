import { reatomComponent } from '@reatom/react';

import { formatNumber, formatPercent } from '#/features/analyses/helpers';
import type { MetricContribution } from '#/features/analyses/types';
import { cn } from '#/shared/lib/bem';
import { formatMetricValue } from '#/shared/lib/formatMetricValue';
import { HintLabel } from '#/shared/ui/HintLabel';

import './ClusterMetricsGrid.scss';

const cnClusterMetricsGrid = cn('ClusterMetricsGrid');

const numericColumns = [
  { label: 'Value', hint: 'Measured value of the metric.' },
  {
    label: 'Fit',
    hint: 'How well the value matches the profile: 100% is the optimal zone, 0% is outside the acceptable range.',
  },
  { label: 'Weight', hint: 'Share of the metric inside its group.' },
  { label: 'Contribution', hint: 'Fit × weight: what the metric adds to the group score.' },
];

export interface ClusterMetricsGridProps {
  metrics: MetricContribution[];
}

export const ClusterMetricsGrid = reatomComponent<ClusterMetricsGridProps>(
  ({ metrics }) => (
    <div className={cnClusterMetricsGrid()}>
      <div className={cnClusterMetricsGrid('Row', { header: true })}>
        <span>Metric</span>
        {numericColumns.map(({ label, hint }) => (
          <span key={label} className={cnClusterMetricsGrid('Number')}>
            <HintLabel hint={hint}>{label}</HintLabel>
          </span>
        ))}
      </div>
      {metrics.map((metric) => (
        <div
          key={metric.key}
          className={cnClusterMetricsGrid('Row', { noData: !metric.data_available })}
        >
          <span>{metric.label || metric.key}</span>
          <span className={cnClusterMetricsGrid('Number')}>
            {formatMetricValue(metric.raw_value, metric.unit)}
          </span>
          <span className={cnClusterMetricsGrid('Number')}>
            {formatPercent(metric.normalized_value)}
          </span>
          <span className={cnClusterMetricsGrid('Number')}>{formatNumber(metric.weight)}</span>
          <span className={cnClusterMetricsGrid('Number')}>
            {metric.contribution != null ? formatNumber(metric.contribution) : '—'}
          </span>
        </div>
      ))}
    </div>
  ),
  'ClusterMetricsGrid'
);
