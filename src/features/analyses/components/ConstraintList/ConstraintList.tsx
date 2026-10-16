import { Chip, Paper, Tooltip, Typography } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import {
  formatArea,
  formatNumber,
  formatShare,
  getRestrictionKindLabel,
} from '#/features/analyses/helpers';
import type { AppliedConstraint, ConstraintExtension } from '#/features/analyses/types';
import { cn } from '#/shared/lib/bem';

import './ConstraintList.scss';

const cnConstraintList = cn('ConstraintList');

export interface ConstraintListProps {
  extension: ConstraintExtension;
  totalScore: number;
  scaleMax: number;
}

const effectLabel = (constraint: AppliedConstraint): string =>
  constraint.effect === 'prohibit'
    ? 'Prohibits building'
    : `Score × ${constraint.factor.toFixed(2)}`;

const effectHint = (constraint: AppliedConstraint): string =>
  constraint.effect === 'prohibit'
    ? 'The zone bars the scenario: the final score is set to 0.'
    : 'The score is multiplied by this factor; penalties of different zones multiply.';

export const ConstraintList = reatomComponent<ConstraintListProps>(
  ({ extension, totalScore, scaleMax }) => {
    const constraints = extension.applied_constraints;

    return (
      <Paper variant="outlined" className={cnConstraintList()}>
        <div className={cnConstraintList('Scores')}>
          <span>
            Before constraints{' '}
            <b>
              {formatNumber(extension.base_score)} / {formatNumber(scaleMax)}
            </b>
          </span>
          <span>
            Final{' '}
            <b>
              {formatNumber(totalScore)} / {formatNumber(scaleMax)}
            </b>
          </span>
        </div>

        {constraints.length === 0 ? (
          <Typography variant="body2" className={cnConstraintList('Muted')}>
            No restriction zone lowers the score of this parcel.
          </Typography>
        ) : (
          <ul className={cnConstraintList('List')}>
            {constraints.map((constraint) => (
              <li
                key={constraint.kind}
                className={cnConstraintList('Item')}
                data-effect={constraint.effect}
              >
                <div className={cnConstraintList('ItemHeader')}>
                  <span className={cnConstraintList('Label')}>
                    {getRestrictionKindLabel(constraint.kind)}
                  </span>
                  <Tooltip title={effectHint(constraint)} placement="top" arrow>
                    <Chip
                      size="small"
                      label={effectLabel(constraint)}
                      color={constraint.effect === 'prohibit' ? 'error' : 'warning'}
                      variant={constraint.effect === 'prohibit' ? 'filled' : 'outlined'}
                    />
                  </Tooltip>
                </div>
                <span className={cnConstraintList('Details')}>
                  Covers {formatShare(constraint.overlap_share)} of the parcel (
                  {formatArea(constraint.overlap_area_m2)})
                  {constraint.zone_names.length > 0 && ` · ${constraint.zone_names.join(', ')}`}
                </span>
                {constraint.legal_basis && (
                  <span className={cnConstraintList('Basis')}>Basis: {constraint.legal_basis}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </Paper>
    );
  },
  'ConstraintList'
);
