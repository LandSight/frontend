import { Paper } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import { profilesAtom } from '#/features/analyses/models/analyses';
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
  const profileName = profilesAtom()[report.scenario]?.name ?? report.scenario;

  return (
    <Paper
      variant="outlined"
      className={cnVerdictCard()}
      data-verdict={report.verdict ?? undefined}
    >
      <div className={cnVerdictCard('Verdict')}>
        {VerdictIcon && <VerdictIcon className={cnVerdictCard('Icon')} />}
        <div className={cnVerdictCard('Text')}>
          <span className={cnVerdictCard('Label')}>
            {verdictText ? capitalize(verdictText) : '—'}
          </span>
          {profileName && <span className={cnVerdictCard('Profile')}>for {profileName}</span>}
        </div>
      </div>

      <ScoreGauge
        value={report.total_score}
        max={report.scale_max}
        className={cnVerdictCard('Gauge')}
      />
    </Paper>
  );
}, 'VerdictCard');
