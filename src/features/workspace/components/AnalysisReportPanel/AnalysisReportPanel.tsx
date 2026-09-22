import { ChevronRight as ChevronRightIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Chip, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import { requestDeleteAnalysis } from '#/features/analyses/models';
import { analysesAtom } from '#/features/analyses/models/analyses';
import { analysisStatusLabels } from '#/features/analyses/types';
import { cn } from '#/shared/lib/bem';

import { closeReport } from '../../models';

import './AnalysisReportPanel.scss';

const cnAnalysisReportPanel = cn('AnalysisReportPanel');

export interface AnalysisReportPanelProps {
  analysisId: string;
}

const formatDate = (value: string) => new Date(value).toLocaleString();

export const AnalysisReportPanel = reatomComponent(({ analysisId }: AnalysisReportPanelProps) => {
  const analysis = analysesAtom()[analysisId];

  if (!analysis) {
    return null;
  }

  const canDelete = analysis.status === 'completed' || analysis.status === 'failed';

  return (
    <div className={cnAnalysisReportPanel()}>
      <div className={cnAnalysisReportPanel('Header')}>
        <Tooltip title="Close report">
          <IconButton size="small" onClick={wrap(closeReport)}>
            <ChevronRightIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={canDelete ? 'Delete analysis' : 'Cannot delete while processing'}>
          <span>
            <IconButton
              size="small"
              color="error"
              disabled={!canDelete}
              onClick={() => wrap(requestDeleteAnalysis(analysisId))}
            >
              <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>
      </div>

      <div className={cnAnalysisReportPanel('Body')}>
        <Typography variant="h6" className={cnAnalysisReportPanel('Title')}>
          {analysis.name || 'Analysis'}
        </Typography>
        <Typography variant="body2" className={cnAnalysisReportPanel('Muted')}>
          {analysis.parcel_name ?? 'Unknown parcel'}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Chip
            label={analysisStatusLabels[analysis.status]}
            size="small"
            className={cnAnalysisReportPanel('Status', { [analysis.status]: true })}
          />
          {analysis.status === 'completed' && analysis.score != null ? (
            <Chip
              label={`Score: ${analysis.score.toFixed(1)}`}
              size="small"
              className={cnAnalysisReportPanel('Score')}
              style={{ backgroundColor: `hsl(${analysis.score * 12}, 90%, 45%)` }}
            />
          ) : (
            <Chip label="Score: —" size="small" className={cnAnalysisReportPanel('ScoreDash')} />
          )}
        </Stack>

        <Typography variant="body2" className={cnAnalysisReportPanel('Muted')}>
          Created: {formatDate(analysis.created_at)}
        </Typography>
        {analysis.status_reason && (
          <Typography variant="body2" color="error">
            {analysis.status_reason}
          </Typography>
        )}

        <Divider className={cnAnalysisReportPanel('Divider')} />
        <Typography variant="body2" className={cnAnalysisReportPanel('Muted')}>
          Report text will be available later. For now this is the current analysis information.
        </Typography>
      </div>
    </div>
  );
}, 'AnalysisReportPanel');
