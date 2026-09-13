import React from 'react';
import { Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@mui/material';
import { useAction, useAtom } from '@reatom/react';

import { analysisStatusLabels } from '#/features/analyses/types';
import { cn } from '#/shared/lib/bem';

import { deleteAnalysis, filtersAtom } from '../../models/analyses';
import type { SortBy } from '../../types';

import { formatDate } from './helpers';
import type { AnalysesTableProps } from './types';

import './AnalysesTable.scss';

const cnAnalysesTable = cn('AnalysesTable');

type SortableColumn = SortBy;

const columnConfig: { field: SortableColumn; label: string; align: 'center'; className: string }[] =
  [
    { field: 'name', label: 'Name', align: 'center', className: cnAnalysesTable('col-name') },
    {
      field: 'parcel_name',
      label: 'Parcel',
      align: 'center',
      className: cnAnalysesTable('col-parcel'),
    },
    { field: 'status', label: 'Status', align: 'center', className: cnAnalysesTable('col-status') },
    {
      field: 'created_at',
      label: 'Created',
      align: 'center',
      className: cnAnalysesTable('col-created'),
    },
    { field: 'score', label: 'Score', align: 'center', className: cnAnalysesTable('col-score') },
  ];

export const AnalysesTable: React.FC<AnalysesTableProps> = ({ analyses }) => {
  const [filters] = useAtom(filtersAtom);
  const handleDelete = useAction(deleteAnalysis);
  const setSortBy = useAction(filtersAtom.setSortBy);
  const setSortOrder = useAction(filtersAtom.setSortOrder);

  const handleSort = (field: SortBy) => {
    if (filters.sortBy === field) {
      setSortOrder(filters.sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <TableContainer component={Paper} className={cnAnalysesTable()}>
      <Table size="medium">
        <TableHead>
          <TableRow>
            {columnConfig.map(({ field, label, align, className }) => (
              <TableCell key={field} align={align} className={className}>
                <TableSortLabel
                  active={filters.sortBy === field}
                  direction={filters.sortOrder}
                  onClick={() => handleSort(field)}
                >
                  {label}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell align="center" className={cnAnalysesTable('col-actions')}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {analyses.map((analysis) => (
            <TableRow key={analysis.id} hover>
              <TableCell align="center" className={cnAnalysesTable('col-name')}>
                {analysis.name || '—'}
              </TableCell>
              <TableCell align="center" className={cnAnalysesTable('col-parcel')}>
                {analysis.parcel_name || 'Unknown'}
              </TableCell>
              <TableCell align="center" className={cnAnalysesTable('col-status')}>
                <Box className={cnAnalysesTable('Status')}>
                  <Chip
                    label={analysisStatusLabels[analysis.status] || analysis.status}
                    size="small"
                    className={cnAnalysesTable('StatusBadge', { [analysis.status]: true })}
                    icon={
                      analysis.status === 'running' ? <CircularProgress size={12} /> : undefined
                    }
                  />
                </Box>
              </TableCell>
              <TableCell align="center" className={cnAnalysesTable('col-created')}>
                {formatDate(analysis.created_at)}
              </TableCell>
              <TableCell align="center" className={cnAnalysesTable('col-score')}>
                {analysis.status === 'completed' && analysis.score != null ? (
                  <Chip
                    label={analysis.score.toFixed(1)}
                    size="small"
                    className={cnAnalysesTable('ScoreChip')}
                    style={
                      {
                        backgroundColor: `hsl(${analysis.score * 12}, 90%, 45%)`,
                      } as React.CSSProperties
                    }
                  />
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell align="center" className={cnAnalysesTable('col-actions')}>
                <Tooltip title="Report coming soon">
                  <span>
                    <IconButton size="small" disabled>
                      <ViewIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" color="error" onClick={() => handleDelete(analysis.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
