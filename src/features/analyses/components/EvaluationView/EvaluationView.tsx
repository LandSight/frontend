import { CircularProgress, Paper, Typography } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import { enginesAtom, evaluationAtom, fetchEvaluation } from '#/features/analyses/models/analyses';
import type { ClusterScore } from '#/features/analyses/types';
import { cn } from '#/shared/lib/bem';
import { ScoreGauge } from '#/shared/ui/ScoreGauge';
import { SectionTitle } from '#/shared/ui/SectionTitle';

import { ClusterCard } from '../ClusterCard';

import './EvaluationView.scss';

const cnEvaluationView = cn('EvaluationView');

export const EvaluationView = reatomComponent(() => {
  const evaluation = evaluationAtom();
  const isLoading = fetchEvaluation.status().isPending;
  const engines = enginesAtom();

  if (isLoading && !evaluation) {
    return (
      <div className={cnEvaluationView({ loading: true })}>
        <CircularProgress size={64} />
      </div>
    );
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
  const engineName = engines[evaluation.engine]?.name ?? evaluation.engine;

  return (
    <div className={cnEvaluationView()}>
      <Paper variant="outlined" className={cnEvaluationView('Header')}>
        <div className={cnEvaluationView('Title')}>
          <span className={cnEvaluationView('Label')}>Final score</span>
          <span className={cnEvaluationView('Meta')}>
            {engineName} · model {evaluation.model_version}
          </span>
        </div>
        <ScoreGauge
          value={evaluation.total_score}
          max={evaluation.scale_max}
          className={cnEvaluationView('Gauge')}
        />
      </Paper>

      <SectionTitle>Aspects</SectionTitle>
      {clusters.length === 0 ? (
        <Typography variant="body2" className={cnEvaluationView('Muted')}>
          Hierarchical breakdown is not available for this engine.
        </Typography>
      ) : (
        <div className={cnEvaluationView('Clusters')}>
          {clusters.map((cluster) => (
            <ClusterCard key={cluster.key} cluster={cluster} />
          ))}
        </div>
      )}
    </div>
  );
}, 'EvaluationView');
