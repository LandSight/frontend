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
import { formatMetricValue } from '#/shared/lib/formatMetricValue';

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

const positionLabels: Record<MetricInfo['position'], string | null> = {
  optimal: 'optimal',
  partial_low: 'below optimal',
  partial_high: 'above optimal',
  out_low: 'below threshold',
  out_high: 'above threshold',
  unknown: null,
};

const generatingMessages: Partial<Record<InterpretationStatus, string>> = {
  ordered: 'The report has been queued for generation… This usually takes a few minutes.',
  running:
    'The report is being generated… This usually takes a few minutes. In the meantime, you can review the assessment results on the "Evaluation" tab.',
  failed: 'Failed to generate the report. Try generating it again.',
};

const noReportMessage = 'No report has been generated for this analysis yet.';

const formatNumber = (value: number): string =>
  Number.isInteger(value) ? String(value) : value.toFixed(2);

const formatPoints = (value: number): string => value.toFixed(2);

const formatPercent = (share: number): string => `${Math.round(share * 100)}%`;

const MetricRow = ({ metric }: { metric: MetricInfo }) => (
  <div className={cnAnalysisReport('Metric')}>
    <span className={cnAnalysisReport('MetricName')}>{metric.label || metric.key}</span>
    <span className={cnAnalysisReport('MetricValue')}>
      {formatMetricValue(metric.raw_value, metric.unit)}
    </span>
    <span className={cnAnalysisReport('MetricPosition')} data-position={metric.position}>
      {positionLabels[metric.position] ?? ''}
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
      <span className={cnAnalysisReport('AspectScore')}>
        {formatPoints(aspect.points)} / {formatPoints(aspect.max_points)} pts
      </span>
    </div>
    <div className={cnAnalysisReport('AspectBar')}>
      <div
        className={cnAnalysisReport('AspectBarFill')}
        style={{
          width: formatPercent(aspect.max_points > 0 ? aspect.points / aspect.max_points : 0),
        }}
      />
    </div>
    {aspect.loss > 0 && (
      <span className={cnAnalysisReport('AspectLoss')}>
        −{formatPoints(aspect.loss)} pts ({formatPercent(aspect.loss_share)} lost)
      </span>
    )}
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
    // While a generation is in progress the button is hidden, so the user
    // cannot order a duplicate run.
    const isGeneratingNow = status === 'ordered' || status === 'running' || isGenerating;
    const message = (status ? generatingMessages[status] : null) ?? noReportMessage;

    if (isGeneratingNow) {
      return (
        <div className={cnAnalysisReport({ generating: true })}>
          <Typography variant="body2" className={cnAnalysisReport('Muted')}>
            {message}
          </Typography>
          <div className={cnAnalysisReport('Loader')}>
            <CircularProgress size={64} />
          </div>
        </div>
      );
    }

    return (
      <div className={cnAnalysisReport()}>
        <Typography variant="body2" className={cnAnalysisReport('Muted')}>
          {message}
        </Typography>
        <Button variant="outlined" size="small" onClick={generate}>
          Generate report
        </Button>
      </div>
    );
  }

  return (
    <div className={cnAnalysisReport()}>
      <div className={cnAnalysisReport('Total')}>
        <span className={cnAnalysisReport('TotalScore')}>
          {formatPoints(report.total_score)} / {formatNumber(report.scale_max)}
        </span>
        {report.verdict && (
          <span className={cnAnalysisReport('Verdict')} data-verdict={report.verdict}>
            {report.verdict_label ?? report.verdict}
          </span>
        )}
      </div>

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
