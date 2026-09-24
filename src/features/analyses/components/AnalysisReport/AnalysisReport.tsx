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
  const isCompleted = analysis.status === 'completed';

  return (
    <div className={cnAnalysisReport()}>
      <Typography variant="body2" className={cnAnalysisReport('Muted')}>
        {isCompleted
          ? 'Report text will be available later. For now this is the current analysis information.'
          : 'Report will be generated once the analysis is completed.'}
      </Typography>
    </div>
  );
}, 'AnalysisReport');
