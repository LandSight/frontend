import React from 'react';
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
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

import { cn } from '#/shared/lib/bem';

import { deleteAnalysis, exportMetrics, filtersAtom } from '../../models/analyses';
import type { SortBy } from '../../types';

import { analysisStatusMap, formatDate } from './helpers';
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
  const handleExport = useAction(exportMetrics);
  const setSortBy = useAction(filtersAtom.setSortBy);
  const setSortOrder = useAction(filtersAtom.setSortOrder);

  const handleViewReport = (analysisId: string) => {
    // TODO: navigate to report page
    window.open(`/reports/${analysisId}`, '_blank');
  };

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
                    label={analysisStatusMap[analysis.status] || analysis.status}
                    size="small"
                    className={cnAnalysesTable('StatusBadge', { [analysis.status]: true })}
                    icon={
                      analysis.status === 'processing' ? <CircularProgress size={12} /> : undefined
                    }
                  />
                </Box>
              </TableCell>
              <TableCell align="center" className={cnAnalysesTable('col-created')}>
                {formatDate(analysis.created_at)}
              </TableCell>
              <TableCell align="center" className={cnAnalysesTable('col-score')}>
                {analysis.status === 'completed' && analysis.score !== undefined ? (
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
                <Tooltip title="View report">
                  <IconButton
                    size="small"
                    onClick={() => handleViewReport(analysis.id)}
                    disabled={analysis.status !== 'completed'}
                  >
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Export metrics">
                  <IconButton
                    size="small"
                    onClick={() => handleExport(analysis.id)}
                    disabled={analysis.status !== 'completed'}
                  >
                    <DownloadIcon />
                  </IconButton>
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
