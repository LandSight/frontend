import { ChevronRight as ChevronRightIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Divider, IconButton, Tooltip, Typography } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import { AnalysisReport } from '#/features/analyses/components/AnalysisReport';
import { AnalysisScoreChip } from '#/features/analyses/components/AnalysisScoreChip';
import { AnalysisStatusChip } from '#/features/analyses/components/AnalysisStatusChip';
import type { Analysis } from '#/features/analyses/types';
import { cn } from '#/shared/lib/bem';

import './AnalysisReportPanel.scss';

const cnAnalysisReportPanel = cn('AnalysisReportPanel');

export interface AnalysisReportPanelProps {
  analysis: Analysis;
  onClose: () => void;
  onDelete: (analysisId: string) => void;
}

const formatDate = (value: string) => new Date(value).toLocaleString();

export const AnalysisReportPanel = reatomComponent<AnalysisReportPanelProps>(
  ({ analysis, onClose, onDelete }) => {
    const canDelete = analysis.status === 'completed' || analysis.status === 'failed';

    return (
      <div className={cnAnalysisReportPanel()}>
        <div className={cnAnalysisReportPanel('Header')}>
          <Tooltip title="Close report">
            <IconButton size="small" onClick={onClose}>
              <ChevronRightIcon />
            </IconButton>
          </Tooltip>

          <Typography variant="h6" noWrap className={cnAnalysisReportPanel('Title')}>
            {analysis.name || 'Analysis'}
          </Typography>

          <Tooltip title={canDelete ? 'Delete analysis' : 'Cannot delete while processing'}>
            <span>
              <IconButton
                size="small"
                color="error"
                disabled={!canDelete}
                onClick={() => onDelete(analysis.id)}
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </div>

        <Divider className={cnAnalysisReportPanel('Divider')} />

        <div className={cnAnalysisReportPanel('Info')}>
          <div className={cnAnalysisReportPanel('InfoRow')}>
            <span className={cnAnalysisReportPanel('InfoLabel')}>Parcel:</span>
            <span>{analysis.parcel_name ?? 'Unknown parcel'}</span>
          </div>
          <div className={cnAnalysisReportPanel('InfoRow')}>
            <span className={cnAnalysisReportPanel('InfoLabel')}>Status:</span>
            <AnalysisStatusChip status={analysis.status} />
          </div>
          <div className={cnAnalysisReportPanel('InfoRow')}>
            <span className={cnAnalysisReportPanel('InfoLabel')}>Score:</span>
            {analysis.score != null ? <AnalysisScoreChip score={analysis.score} /> : <span>—</span>}
          </div>
          <div className={cnAnalysisReportPanel('InfoRow')}>
            <span className={cnAnalysisReportPanel('InfoLabel')}>Date:</span>
            <span>{formatDate(analysis.created_at)}</span>
          </div>
        </div>

        <Divider className={cnAnalysisReportPanel('Divider')} />

        <div className={cnAnalysisReportPanel('Body')}>
          {analysis.status_reason && (
            <Typography variant="body2" color="error">
              {analysis.status_reason}
            </Typography>
          )}
          <AnalysisReport analysis={analysis} />
        </div>
      </div>
    );
  },
  'AnalysisReportPanel'
);
