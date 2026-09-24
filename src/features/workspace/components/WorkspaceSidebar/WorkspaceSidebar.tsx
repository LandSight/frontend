import { Box, Divider } from '@mui/material';
import { effect, wrap } from '@reatom/core';
import { reatomFactoryComponent } from '@reatom/react';

import { AnalysisDeleteDialog } from '#/features/analyses/components/AnalysisDeleteDialog';
import { requestDeleteAnalysis } from '#/features/analyses/models';
import { cn } from '#/shared/lib/bem';

import {
  closeReport,
  isReportOpenAtom,
  selectedAnalysisAtom,
  selectedAnalysisIdAtom,
  workspaceViewAtom,
} from '../../models';
import { AnalysesPanel } from '../AnalysesPanel';
import { AnalysisReportPanel } from '../AnalysisReportPanel';
import { ParcelsPanel } from '../ParcelsPanel';
import { ViewSwitcher } from '../ViewSwitcher';

import './WorkspaceSidebar.scss';

const cnWorkspaceSidebar = cn('WorkspaceSidebar');

export const WorkspaceSidebar = reatomFactoryComponent(() => {
  effect(() => {
    if (selectedAnalysisAtom() === null && selectedAnalysisIdAtom() !== null) {
      closeReport();
    }
  }, 'closeDeletedAnalysisEffect');

  return () => {
    const isReportOpen = isReportOpenAtom();
    const analysis = selectedAnalysisAtom();
    const view = workspaceViewAtom();

    const showReport = isReportOpen && analysis !== null;

    return (
      <Box component="aside" className={cnWorkspaceSidebar({ report: showReport })}>
        {showReport && analysis ? (
          <AnalysisReportPanel
            analysis={analysis}
            onClose={wrap(closeReport)}
            onDelete={wrap(requestDeleteAnalysis)}
          />
        ) : (
          <>
            <ViewSwitcher />
            <Divider className={cnWorkspaceSidebar('Divider')} />
            {view === 'parcels' ? <ParcelsPanel /> : <AnalysesPanel />}
          </>
        )}
        <AnalysisDeleteDialog />
      </Box>
    );
  };
}, 'WorkspaceSidebar');
