import { CircularProgress, Typography } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import { evaluationAtom, fetchEvaluation } from '#/features/analyses/models/analyses';
import type { ClusterScore, MetricContribution } from '#/features/analyses/types';
import { cn } from '#/shared/lib/bem';
import { formatMetricValue } from '#/shared/lib/formatMetricValue';

import './EvaluationView.scss';

const cnEvaluationView = cn('EvaluationView');

const formatNumber = (value: number): string =>
  Number.isInteger(value) ? String(value) : value.toFixed(2);

const formatPercent = (value: number | null): string =>
  value == null ? '—' : `${Math.round(value * 100)}%`;

const formatDate = (value: string | null): string =>
  value ? new Date(value).toLocaleString() : '—';

const MetricRow = ({ metric }: { metric: MetricContribution }) => (
  <div className={cnEvaluationView('MetricRow')}>
    <span className={cnEvaluationView('MetricName')} title={metric.label || metric.key}>
      {metric.label || metric.key}
    </span>
    <span className={cnEvaluationView('MetricValue')}>
      {formatMetricValue(metric.raw_value, metric.unit)}
    </span>
    <span className={cnEvaluationView('MetricNorm')}>{formatPercent(metric.normalized_value)}</span>
    <span className={cnEvaluationView('MetricWeight')}>{formatNumber(metric.weight)}</span>
    <span className={cnEvaluationView('MetricContribution')}>
      {metric.contribution != null ? formatNumber(metric.contribution) : '—'}
    </span>
  </div>
);

const ClusterBlock = ({ cluster, depth = 0 }: { cluster: ClusterScore; depth?: number }) => (
  <div className={cnEvaluationView('Cluster')} style={{ marginLeft: depth * 16 }}>
    <div className={cnEvaluationView('ClusterHeader')}>
      <span className={cnEvaluationView('ClusterName')} title={cluster.name || cluster.key}>
        {cluster.name || cluster.key}
      </span>
      <span className={cnEvaluationView('ClusterScore')}>{formatNumber(cluster.score)}</span>
      <span className={cnEvaluationView('ClusterMeta')}>
        weight {formatNumber(cluster.weight)} · contribution {formatNumber(cluster.contribution)}
      </span>
    </div>

    {cluster.subclusters.length > 0 && (
      <div className={cnEvaluationView('Subclusters')}>
        {cluster.subclusters.map((subcluster) => (
          <ClusterBlock key={subcluster.key} cluster={subcluster} depth={depth + 1} />
        ))}
      </div>
    )}

    {cluster.metrics.length > 0 && (
      <div className={cnEvaluationView('Metrics')}>
        <div className={cnEvaluationView('MetricRow', { header: true })}>
          <span>Metric</span>
          <span>Value</span>
          <span>Score</span>
          <span>Weight</span>
          <span>Contribution</span>
        </div>
        {cluster.metrics.map((metric) => (
          <MetricRow key={metric.key} metric={metric} />
        ))}
      </div>
    )}
  </div>
);

export const EvaluationView = reatomComponent(() => {
  const evaluation = evaluationAtom();
  const isLoading = fetchEvaluation.status().isPending;

  if (isLoading && !evaluation) {
    return <CircularProgress size={20} />;
  }

  if (!evaluation) {
    return (
      <Typography variant="body2" className={cnEvaluationView('Muted')}>
        Evaluation unavailable.
      </Typography>
    );
  }

  const extension: unknown = evaluation.extensions['hierarchical'];
  const clusters: ClusterScore[] =
    extension != null && typeof extension === 'object' && 'clusters' in extension
      ? (extension as { clusters: ClusterScore[] }).clusters
      : [];

  return (
    <div className={cnEvaluationView()}>
      <div className={cnEvaluationView('Header')}>
        <div className={cnEvaluationView('ScoreRow')}>
          <span className={cnEvaluationView('ScoreLabel')}>Final score</span>
          <span className={cnEvaluationView('ScoreValue')}>
            {formatNumber(evaluation.total_score)}
          </span>
          <span className={cnEvaluationView('ScoreScale')}>
            / {formatNumber(evaluation.scale_max)}
          </span>
        </div>
        <div className={cnEvaluationView('Meta')}>
          <span>{evaluation.scenario}</span>
          <span>{evaluation.engine}</span>
          <span>v{evaluation.model_version}</span>
          <span>{formatDate(evaluation.metadata.evaluated_at)}</span>
        </div>
      </div>

      {clusters.length === 0 ? (
        <Typography variant="body2" className={cnEvaluationView('Muted')}>
          Hierarchical breakdown is not available for this engine.
        </Typography>
      ) : (
        <div className={cnEvaluationView('Clusters')}>
          {clusters.map((cluster) => (
            <ClusterBlock key={cluster.key} cluster={cluster} />
          ))}
        </div>
      )}
    </div>
  );
}, 'EvaluationView');
