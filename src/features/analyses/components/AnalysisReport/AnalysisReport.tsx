import { Button, CircularProgress, Typography } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import {
  fetchInterpretation,
  interpretationAtom,
  regenerateInterpretation,
} from '#/features/analyses/models/analyses';
import type { Analysis, AspectInterpretation, MetricInfo } from '#/features/analyses/types';
import { cn } from '#/shared/lib/bem';

import './AnalysisReport.scss';

const cnAnalysisReport = cn('AnalysisReport');

export interface AnalysisReportProps {
  analysis: Analysis;
}

const roleLabels: Record<MetricInfo['role'], string> = {
  strong: 'strong',
  weak: 'weak',
  neutral: 'neutral',
};

const formatNumber = (value: number): string =>
  Number.isInteger(value) ? String(value) : value.toFixed(2);

const MetricRow = ({ metric }: { metric: MetricInfo }) => (
  <div className={cnAnalysisReport('Metric')}>
    <span className={cnAnalysisReport('MetricName')}>{metric.label || metric.key}</span>
    <span className={cnAnalysisReport('MetricValue')}>
      {metric.raw_value != null
        ? `${formatNumber(metric.raw_value)}${metric.unit ? ` ${metric.unit}` : ''}`
        : '—'}
    </span>
    <span className={cnAnalysisReport('MetricRole')} data-role={metric.role}>
      {roleLabels[metric.role]}
    </span>
  </div>
);

const AspectCard = ({ aspect }: { aspect: AspectInterpretation }) => (
  <div className={cnAnalysisReport('Aspect')}>
    <div className={cnAnalysisReport('AspectHeader')}>
      <span className={cnAnalysisReport('AspectName')}>{aspect.name || aspect.key}</span>
      <span className={cnAnalysisReport('AspectScore')}>{aspect.score.toFixed(2)}</span>
    </div>
    {aspect.explanation && (
      <Typography variant="body2" className={cnAnalysisReport('Explanation')}>
        {aspect.explanation}
      </Typography>
    )}
    {aspect.top_metrics.length > 0 && (
      <div className={cnAnalysisReport('Metrics')}>
        {aspect.top_metrics.map((metric) => (
          <MetricRow key={metric.key} metric={metric} />
        ))}
      </div>
    )}
  </div>
);

export const AnalysisReport = reatomComponent<AnalysisReportProps>(({ analysis }) => {
  const report = interpretationAtom();
  const isLoading = fetchInterpretation.status().isPending;
  const isRegenerating = regenerateInterpretation.status().isPending;

  const regenerate = () => {
    void regenerateInterpretation(analysis.id);
  };

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

  if (!report) {
    return (
      <div className={cnAnalysisReport()}>
        <Typography variant="body2" className={cnAnalysisReport('Muted')}>
          Report is not available yet. It is generated automatically after scoring.
        </Typography>
        <Button variant="outlined" size="small" disabled={isRegenerating} onClick={regenerate}>
          {isRegenerating ? 'Generating…' : 'Generate report'}
        </Button>
      </div>
    );
  }

  return (
    <div className={cnAnalysisReport()}>
      <Typography variant="body2" className={cnAnalysisReport('Muted')}>
        {report.scenario} · score {report.total_score.toFixed(2)} of {report.scale}
      </Typography>

      {report.top_aspects_summary && (
        <Typography variant="body1" className={cnAnalysisReport('Summary')}>
          {report.top_aspects_summary}
        </Typography>
      )}

      <div className={cnAnalysisReport('Aspects')}>
        {report.aspects.map((aspect) => (
          <AspectCard key={aspect.key} aspect={aspect} />
        ))}
      </div>

      <div className={cnAnalysisReport('Actions')}>
        <Button variant="text" size="small" disabled={isRegenerating} onClick={regenerate}>
          {isRegenerating ? 'Regenerating…' : 'Regenerate report'}
        </Button>
      </div>
    </div>
  );
}, 'AnalysisReport');
