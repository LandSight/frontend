import type { MouseEvent } from 'react';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Chip, IconButton, ListItemButton, ListItemText, Tooltip } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import { type Analysis, analysisStatusLabels } from '#/features/analyses/types';
import { cn } from '#/shared/lib/bem';

import './AnalysisRow.scss';

const cnAnalysisRow = cn('AnalysisRow');

export interface AnalysisRowProps {
  analysis: Analysis;
  selected: boolean;
  showParcel?: boolean;
  canDelete: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AnalysisRow = reatomComponent<AnalysisRowProps>(
  ({ analysis, selected, showParcel = false, canDelete, onSelect, onDelete }) => {
    const handleDelete = (event: MouseEvent) => {
      event.stopPropagation();
      onDelete(analysis.id);
    };

    const hasScore = analysis.status === 'completed' && analysis.score != null;

    return (
      <ListItemButton
        selected={selected}
        onClick={() => onSelect(analysis.id)}
        dense
        className={cnAnalysisRow({ selected })}
      >
        <ListItemText
          primary={analysis.name || '—'}
          secondary={showParcel ? (analysis.parcel_name ?? 'Unknown parcel') : undefined}
          slotProps={{
            primary: { noWrap: true },
            secondary: { noWrap: true, className: cnAnalysisRow('Secondary') },
          }}
        />
        <Chip
          label={analysisStatusLabels[analysis.status]}
          size="small"
          className={cnAnalysisRow('Status', { [analysis.status]: true })}
        />
        {hasScore ? (
          <Chip
            label={analysis.score?.toFixed(1)}
            size="small"
            className={cnAnalysisRow('Score')}
            style={{ backgroundColor: `hsl(${(analysis.score ?? 0) * 12}, 90%, 45%)` }}
          />
        ) : (
          <Chip label="—" size="small" className={cnAnalysisRow('ScoreDash')} />
        )}
        <Tooltip title={canDelete ? 'Delete' : 'Cannot delete while processing'}>
          <span>
            <IconButton
              size="small"
              color="error"
              disabled={!canDelete}
              onClick={handleDelete}
              className={cnAnalysisRow('Delete')}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </ListItemButton>
    );
  },
  'AnalysisRow'
);
