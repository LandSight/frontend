import type { MouseEvent } from 'react';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { IconButton, ListItemButton, ListItemText, Stack, Tooltip } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import type { Analysis } from '#/features/analyses/types';
import { cn } from '#/shared/lib/bem';

import { AnalysisScoreChip } from '../AnalysisScoreChip';
import { AnalysisStatusChip } from '../AnalysisStatusChip';

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
        <Stack direction="row" spacing={0.5} alignItems="center" className={cnAnalysisRow('Chips')}>
          <AnalysisStatusChip status={analysis.status} variant="outlined" />
          {analysis.status === 'completed' && analysis.score != null && (
            <AnalysisScoreChip score={analysis.score} variant="outlined" />
          )}
        </Stack>
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
