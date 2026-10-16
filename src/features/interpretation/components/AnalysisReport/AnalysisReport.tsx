import { Button, CircularProgress, Typography } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import type { Analysis } from '#/features/analyses/types';
import { generatingMessages, noReportMessage } from '#/features/interpretation/constants';
import {
  generateReport,
  interpretationAtom,
  interpretationStatusAtom,
} from '#/features/interpretation/models';
import { cn } from '#/shared/lib/bem';
import { SectionTitle } from '#/shared/ui/SectionTitle';

import { AspectCard } from '../AspectCard';
import { ConstraintsCard } from '../ConstraintsCard';
import { VerdictCard } from '../VerdictCard';

import './AnalysisReport.scss';

const cnAnalysisReport = cn('AnalysisReport');

export interface AnalysisReportProps {
  analysis: Analysis;
}

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
      <VerdictCard report={report} />

      <SectionTitle>Aspects</SectionTitle>
      <div className={cnAnalysisReport('Aspects')}>
        {report.aspects.map((aspect) => (
          <AspectCard key={aspect.key} aspect={aspect} />
        ))}
      </div>

      {report.top_aspects_summary && (
        <>
          <SectionTitle>Overall assessment</SectionTitle>
          <Typography variant="body1" className={cnAnalysisReport('Summary')}>
            {report.top_aspects_summary}
          </Typography>
        </>
      )}

      {report.constraints.length > 0 && (
        <>
          <SectionTitle>Restrictions</SectionTitle>
          <ConstraintsCard report={report} />
        </>
      )}
    </div>
  );
}, 'AnalysisReport');
