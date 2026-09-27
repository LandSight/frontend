import { Typography } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import type { Analysis } from '#/features/analyses/types';
import { cn } from '#/shared/lib/bem';

import './AnalysisReport.scss';

const cnAnalysisReport = cn('AnalysisReport');

export interface AnalysisReportProps {
  analysis: Analysis;
}

export const AnalysisReport = reatomComponent<AnalysisReportProps>(({ analysis }) => {
  const message =
    analysis.status === 'completed'
      ? 'Report text will be available later. For now this is the current analysis information.'
      : analysis.status === 'failed'
        ? 'Analysis failed before a report could be generated.'
        : 'Report will be generated once the analysis is completed.';

  return (
    <div className={cnAnalysisReport()}>
      <Typography variant="body2" className={cnAnalysisReport('Muted')}>
        {message}
      </Typography>
    </div>
  );
}, 'AnalysisReport');
