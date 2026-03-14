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
  Tooltip,
} from '@mui/material';
import { useAction } from '@reatom/react';

import { cn } from '#/shared/lib/bem';

import { deleteAnalysis, exportMetrics } from '../../models/analysis';

import { analysisStatusMap, analysisTypeMap, formatDate } from './helpers';
import type { AnalysesTableProps } from './types';

import './AnalysesTable.scss';

const cnAnalysesTable = cn('AnalysesTable');

export const AnalysesTable: React.FC<AnalysesTableProps> = ({ analyses }) => {
  const handleDelete = useAction(deleteAnalysis);
  const handleExport = useAction(exportMetrics);

  const handleViewReport = (analysisId: string) => {
    // TODO: navigate to report page
    window.open(`/reports/${analysisId}`, '_blank');
  };

  return (
    <TableContainer component={Paper} className={cnAnalysesTable()}>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell align="center">Parcel</TableCell>
            <TableCell align="center">Type</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Created</TableCell>
            <TableCell align="center">Score</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {analyses.map((analysis) => (
            <TableRow key={analysis.id} hover>
              <TableCell align="center">{analysis.parcel_name || 'Unknown'}</TableCell>
              <TableCell align="center">
                <Chip
                  label={analysisTypeMap[analysis.type] || analysis.type}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="center">
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
              <TableCell align="center">{formatDate(analysis.created_at)}</TableCell>
              <TableCell align="center">
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
              <TableCell align="center">
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
