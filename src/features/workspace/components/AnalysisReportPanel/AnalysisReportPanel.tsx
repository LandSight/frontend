import { ChevronRight as ChevronRightIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { IconButton, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import { AnalysisStatusChip } from '#/features/analyses/components/AnalysisStatusChip';
import { EvaluationView } from '#/features/analyses/components/EvaluationView';
import { profilesAtom } from '#/features/analyses/models/analyses';
import type { Analysis } from '#/features/analyses/types';
import { AnalysisReport } from '#/features/interpretation/components/AnalysisReport';
import { cn } from '#/shared/lib/bem';

import type { ReportTab } from '../../models';
import { reportTabAtom, setReportTab } from '../../models';

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
    const tab = reportTabAtom();
    const canDelete = analysis.status === 'completed' || analysis.status === 'failed';
    const profileName = profilesAtom()[analysis.scenario]?.name ?? analysis.scenario;

    return (
      <div className={cnAnalysisReportPanel()}>
        <div className={cnAnalysisReportPanel('Header')}>
          <Tooltip title="Close report">
            <IconButton size="small" onClick={onClose}>
              <ChevronRightIcon />
            </IconButton>
          </Tooltip>

          <div className={cnAnalysisReportPanel('Heading')}>
            <div className={cnAnalysisReportPanel('TitleRow')}>
              <Typography variant="h6" noWrap className={cnAnalysisReportPanel('Title')}>
                {analysis.name || 'Analysis'}
              </Typography>
              <span className={cnAnalysisReportPanel('Parcel')}>
                {analysis.parcel_name ?? 'Unknown parcel'}
              </span>
            </div>
            <div className={cnAnalysisReportPanel('Meta')}>
              <span>{profileName}</span>
              <span>{formatDate(analysis.created_at)}</span>
              {/* A completed analysis needs no status: the panel opens only for finished ones. */}
              {analysis.status === 'failed' && <AnalysisStatusChip status={analysis.status} />}
            </div>
          </div>

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

        <Tabs
          className={cnAnalysisReportPanel('Tabs')}
          value={tab}
          onChange={(_event, value: ReportTab) => setReportTab(value)}
          variant="fullWidth"
        >
          <Tab value="report" label="Report" />
          <Tab value="evaluation" label="Evaluation" />
        </Tabs>

        <div className={cnAnalysisReportPanel('Body')}>
          {analysis.status_reason && (
            <Typography variant="body2" color="error">
              {analysis.status_reason}
            </Typography>
          )}
          {tab === 'evaluation' ? <EvaluationView /> : <AnalysisReport analysis={analysis} />}
        </div>
      </div>
    );
  },
  'AnalysisReportPanel'
);
