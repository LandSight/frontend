import { Chip } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import {
  metricRoleColors,
  metricRoleLabels,
  valuePositionLabels,
} from '#/features/interpretation/constants';
import type { MetricInfo } from '#/features/interpretation/types';
import { cn } from '#/shared/lib/bem';
import { formatMetricValue } from '#/shared/lib/formatMetricValue';
import { HintLabel } from '#/shared/ui/HintLabel';

import './MetricsGrid.scss';

const cnMetricsGrid = cn('MetricsGrid');

export interface MetricsGridProps {
  metrics: MetricInfo[];
  className?: string;
}

export const MetricsGrid = reatomComponent<MetricsGridProps>(
  ({ metrics, className }) => (
    <div className={cnMetricsGrid(null, [className])}>
      <div className={cnMetricsGrid('Row', { header: true })}>
        <span>Metric</span>
        <span className={cnMetricsGrid('Value')}>
          <HintLabel hint="Measured value of the metric.">Value</HintLabel>
        </span>
        <span className={cnMetricsGrid('Position')}>
          <HintLabel hint="Where the value lies relative to the optimal zone and the acceptable range of the profile.">
            Position
          </HintLabel>
        </span>
        <span className={cnMetricsGrid('Role')}>
          <HintLabel hint="Strong: the metric earned (almost) its full points. Weak: it lost points. Neutral: no data.">
            Role
          </HintLabel>
        </span>
      </div>
      {metrics.map((metric) => (
        <div
          key={metric.key}
          className={cnMetricsGrid('Row', { noData: metric.normalized_value === null })}
        >
          <span>{metric.label || metric.key}</span>
          <span className={cnMetricsGrid('Value')}>
            {formatMetricValue(metric.raw_value, metric.unit)}
          </span>
          <span className={cnMetricsGrid('Position')} data-position={metric.position}>
            {valuePositionLabels[metric.position] ?? '—'}
          </span>
          <Chip
            size="small"
            variant="outlined"
            color={metricRoleColors[metric.role]}
            label={metricRoleLabels[metric.role]}
            className={cnMetricsGrid('Role', { chip: true })}
          />
        </div>
      ))}
    </div>
  ),
  'MetricsGrid'
);
