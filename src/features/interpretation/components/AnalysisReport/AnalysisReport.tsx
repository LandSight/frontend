import { Button, CircularProgress, Typography } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import type { Analysis } from '#/features/analyses/types';
import {
  generateReport,
  interpretationAtom,
  interpretationStatusAtom,
} from '#/features/interpretation/models';
import type {
  AspectInterpretation,
  InterpretationStatus,
  MetricInfo,
} from '#/features/interpretation/types';
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

const generatingMessages: Partial<Record<InterpretationStatus, string>> = {
  ordered: 'The report has been queued for generation… This usually takes a few minutes.',
  running:
    'The report is being generated… This usually takes a few minutes. In the meantime, you can review the assessment results on the "Assessment" tab.',
  failed: 'Failed to generate the report. Try generating it again.',
};

const noReportMessage = 'No report has been generated for this analysis yet.';

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
  const status = interpretationStatusAtom();
  const isGenerating = generateReport.status().isPending;

  const generate = () => {
    void generateReport(analysis.id);
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

  if (!report) {
    // The button stays visible but is disabled while a generation is in
    // progress, so the user cannot order a duplicate run.
    const isGeneratingNow = status === 'ordered' || status === 'running';
    const message = (status ? generatingMessages[status] : null) ?? noReportMessage;

    return (
      <div className={cnAnalysisReport()}>
        <div className={cnAnalysisReport('Generating')}>
          {isGeneratingNow && <CircularProgress size={18} />}
          <Typography variant="body2" className={cnAnalysisReport('Muted')}>
            {message}
          </Typography>
        </div>
        <Button
          variant="outlined"
          size="small"
          disabled={isGeneratingNow || isGenerating}
          onClick={generate}
        >
          {isGeneratingNow || isGenerating ? 'Generating…' : 'Generate report'}
        </Button>
      </div>
    );
  }

  return (
    <div className={cnAnalysisReport()}>
      <Typography variant="body2" className={cnAnalysisReport('Muted')}>
        {report.scenario} · score {report.total_score.toFixed(2)} / {formatNumber(report.scale_max)}
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
    </div>
  );
}, 'AnalysisReport');
