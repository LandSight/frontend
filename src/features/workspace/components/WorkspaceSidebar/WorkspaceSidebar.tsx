import { useEffect } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import { AnalysisDeleteDialog } from '#/features/analyses/components/AnalysisDeleteDialog';
import { cn } from '#/shared/lib/bem';

import {
  closeReport,
  isReportOpenAtom,
  selectedAnalysisAtom,
  workspaceViewAtom,
} from '../../models';
import { AnalysesPanel } from '../AnalysesPanel';
import { AnalysisReportPanel } from '../AnalysisReportPanel';
import { ParcelsPanel } from '../ParcelsPanel';

import './WorkspaceSidebar.scss';

const cnWorkspaceSidebar = cn('WorkspaceSidebar');

export const WorkspaceSidebar = reatomComponent(() => {
  const isReportOpen = isReportOpenAtom();
  const analysis = selectedAnalysisAtom();
  const view = workspaceViewAtom();

  const showReport = isReportOpen && analysis !== null;

  // If the selected analysis was deleted, the report no longer has a subject:
  // clear the stale selection and the object layers.
  useEffect(() => {
    if (isReportOpen && analysis === null) {
      wrap(closeReport);
    }
  }, [isReportOpen, analysis]);

  return (
    <Box component="aside" className={cnWorkspaceSidebar({ report: showReport })}>
      {showReport && analysis ? (
        <AnalysisReportPanel analysisId={analysis.id} />
      ) : (
        <>
          <Typography className={cnWorkspaceSidebar('Title')} variant="h6">
            {view === 'parcels' ? 'My parcels' : 'All analyses'}
          </Typography>
          <Divider className={cnWorkspaceSidebar('Divider')} />
          {view === 'parcels' ? <ParcelsPanel /> : <AnalysesPanel />}
        </>
      )}
      <AnalysisDeleteDialog />
    </Box>
  );
}, 'WorkspaceSidebar');
