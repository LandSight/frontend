import { Paper } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import { verdictIcons } from '#/features/interpretation/constants';
import { capitalize } from '#/features/interpretation/helpers';
import type { InterpretationReport } from '#/features/interpretation/types';
import { cn } from '#/shared/lib/bem';
import { ScoreGauge } from '#/shared/ui/ScoreGauge';

import './VerdictCard.scss';

const cnVerdictCard = cn('VerdictCard');

export interface VerdictCardProps {
  report: InterpretationReport;
}

export const VerdictCard = reatomComponent<VerdictCardProps>(({ report }) => {
  const VerdictIcon = report.verdict ? verdictIcons[report.verdict] : null;
  const verdictText = report.verdict_label ?? report.verdict;

  return (
    <Paper
      variant="outlined"
      className={cnVerdictCard()}
      data-verdict={report.verdict ?? undefined}
    >
      <div className={cnVerdictCard('Verdict')}>
        <span className={cnVerdictCard('Label')}>
          {VerdictIcon && <VerdictIcon className={cnVerdictCard('Icon')} />}
          {verdictText ? capitalize(verdictText) : '—'}
        </span>
      </div>

      <ScoreGauge
        value={report.total_score}
        max={report.scale_max}
        className={cnVerdictCard('Gauge')}
      />
    </Paper>
  );
}, 'VerdictCard');
