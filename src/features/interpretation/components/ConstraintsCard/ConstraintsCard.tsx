import { TrendingDown as TrendingDownIcon } from '@mui/icons-material';
import { Chip, Paper, Typography } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import { constraintEffectLabels } from '#/features/interpretation/constants';
import { formatPercent, formatPoints, formatShare } from '#/features/interpretation/helpers';
import type {
  ConstraintInterpretation,
  InterpretationReport,
} from '#/features/interpretation/types';
import { cn } from '#/shared/lib/bem';

import './ConstraintsCard.scss';

const cnConstraintsCard = cn('ConstraintsCard');

export interface ConstraintsCardProps {
  report: InterpretationReport;
}

const effectChipLabel = (constraint: ConstraintInterpretation): string =>
  constraint.effect === 'prohibit'
    ? constraintEffectLabels.prohibit
    : `${constraintEffectLabels.penalty} −${formatPercent(constraint.score_reduction)}`;

export const ConstraintsCard = reatomComponent<ConstraintsCardProps>(({ report }) => {
  const isProhibited = report.verdict === 'prohibited';

  return (
    <Paper variant="outlined" className={cnConstraintsCard()}>
      <div className={cnConstraintsCard('Header')}>
        <span className={cnConstraintsCard('Title')}>
          {isProhibited ? 'Building is prohibited on the parcel' : 'Restrictions lowered the score'}
        </span>
        {report.constraints_loss > 0 && (
          <span className={cnConstraintsCard('Loss')}>
            <TrendingDownIcon fontSize="inherit" />
            {formatPoints(report.base_score ?? report.total_score)} →{' '}
            {formatPoints(report.total_score)} (−{formatPoints(report.constraints_loss)} pts)
          </span>
        )}
      </div>

      {report.constraints_explanation && (
        <Typography variant="body1" className={cnConstraintsCard('Takeaway')}>
          {report.constraints_explanation}
        </Typography>
      )}

      <ul className={cnConstraintsCard('List')}>
        {report.constraints.map((constraint) => {
          // A penalty under a prohibition takes no points: the score is already 0.
          const isOutweighed = isProhibited && constraint.effect === 'penalty';

          return (
            <li
              key={constraint.kind}
              className={cnConstraintsCard('Item')}
              data-effect={constraint.effect}
            >
              <div className={cnConstraintsCard('ItemHeader')}>
                <span className={cnConstraintsCard('Label')}>{constraint.label}</span>
                <Chip
                  size="small"
                  label={effectChipLabel(constraint)}
                  color={constraint.effect === 'prohibit' ? 'error' : 'warning'}
                  variant={constraint.effect === 'prohibit' ? 'filled' : 'outlined'}
                />
                <span className={cnConstraintsCard('Points')}>
                  {isOutweighed
                    ? 'outweighed by the prohibition'
                    : `−${formatPoints(constraint.points_lost)} pts`}
                </span>
              </div>
              <span className={cnConstraintsCard('Details')}>
                Covers {formatShare(constraint.overlap_share)} of the parcel
                {constraint.zone_names.length > 0 && ` · ${constraint.zone_names.join(', ')}`}
              </span>
              {constraint.legal_basis && (
                <span className={cnConstraintsCard('Basis')}>Basis: {constraint.legal_basis}</span>
              )}
            </li>
          );
        })}
      </ul>
    </Paper>
  );
}, 'ConstraintsCard');
