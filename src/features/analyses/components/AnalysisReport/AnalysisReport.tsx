import { CircularProgress, Typography } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import {
  analysisEvaluationAtom,
  fetchAnalysisEvaluation,
} from '#/features/analyses/models/analyses';
import type { Analysis, ClusterScore } from '#/features/analyses/types';
import { cn } from '#/shared/lib/bem';

import './AnalysisReport.scss';

const cnAnalysisReport = cn('AnalysisReport');

export interface AnalysisReportProps {
  analysis: Analysis;
}

interface ClusterNodeProps {
  cluster: ClusterScore;
  depth: number;
}

const ClusterNode = ({ cluster, depth }: ClusterNodeProps) => (
  <div className={cnAnalysisReport('Cluster')} style={{ paddingLeft: `${depth * 12}px` }}>
    <div className={cnAnalysisReport('ClusterHeader')}>
      <span>{cluster.key}</span>
      <span>
        {cluster.score.toFixed(2)} · w {cluster.weight.toFixed(2)}
      </span>
    </div>
    {cluster.metrics.map((metric) => (
      <div key={metric.key} className={cnAnalysisReport('Metric')}>
        <span>{metric.key}</span>
        <span>
          {metric.raw_value != null
            ? `${metric.raw_value}${metric.unit ? ` ${metric.unit}` : ''}`
            : '—'}
        </span>
        <span>{metric.normalized_value != null ? metric.normalized_value.toFixed(2) : '—'}</span>
      </div>
    ))}
    {cluster.subclusters.map((subcluster) => (
      <ClusterNode key={subcluster.key} cluster={subcluster} depth={depth + 1} />
    ))}
  </div>
);

export const AnalysisReport = reatomComponent<AnalysisReportProps>(({ analysis }) => {
  const evaluation = analysisEvaluationAtom();
  const isLoading = fetchAnalysisEvaluation.status().isPending;

  if (analysis.status === 'failed') {
    return (
      <Typography variant="body2" className={cnAnalysisReport('Muted')}>
        Analysis failed before a report could be generated.
      </Typography>
    );
  }

  if (analysis.status !== 'completed') {
    return (
      <Typography variant="body2" className={cnAnalysisReport('Muted')}>
        Report will be generated once the analysis is completed.
      </Typography>
    );
  }

  if (isLoading) {
    return <CircularProgress size={20} />;
  }

  if (!evaluation) {
    return (
      <Typography variant="body2" className={cnAnalysisReport('Muted')}>
        Report is not available yet.
      </Typography>
    );
  }

  const clusters = evaluation.extensions.hierarchical?.clusters ?? [];
  const ruleBased = evaluation.extensions.rule_based;
  const constraintBased = evaluation.extensions.constraint_based;

  return (
    <div className={cnAnalysisReport()}>
      <Typography variant="body2" className={cnAnalysisReport('Muted')}>
        {evaluation.engine} · {evaluation.model_version} · scale {evaluation.scale}
      </Typography>
      {clusters.map((cluster) => (
        <ClusterNode key={cluster.key} cluster={cluster} depth={0} />
      ))}
      {ruleBased && (
        <Typography variant="body2">Base score: {ruleBased.base_score.toFixed(2)}</Typography>
      )}
      {constraintBased && (
        <Typography variant="body2">
          Constraints applied: {constraintBased.applied_constraints.length}
        </Typography>
      )}
    </div>
  );
}, 'AnalysisReport');
