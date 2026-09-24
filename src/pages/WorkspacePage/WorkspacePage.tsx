import { Box } from '@mui/material';
import { effect, sleep, wrap } from '@reatom/core';
import { reatomFactoryComponent } from '@reatom/react';

import { AnalysisStartDialog } from '#/features/analyses/components/AnalysisStartDialog';
import { fetchAnalyses } from '#/features/analyses/models';
import { hasActiveAnalysesAtom } from '#/features/analyses/models/analyses';
import { fetchInfrastructureCategories } from '#/features/infrastructure/models';
import { MapView } from '#/features/map/components/MapView';
import { CreateParcelDialog } from '#/features/parcels/components/CreateParcelDialog';
import { fetchParcels } from '#/features/parcels/models';
import { WorkspaceSidebar } from '#/features/workspace/components/WorkspaceSidebar';
import { initWorkspaceUrlSync } from '#/features/workspace/urlSync';

const POLL_INTERVAL_MS = 3000;

export const WorkspacePage = reatomFactoryComponent(() => {
  initWorkspaceUrlSync();

  effect(() => {
    fetchParcels();
    fetchAnalyses();
    fetchInfrastructureCategories();
  }, 'workspaceInitEffect');

  effect(async () => {
    if (!hasActiveAnalysesAtom()) {
      return;
    }
    for (;;) {
      await wrap(sleep(POLL_INTERVAL_MS));
      await wrap(fetchAnalyses());
    }
  }, 'analysesPollingEffect');

  return () => (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <Box sx={{ flex: 1, position: 'relative', minWidth: 0 }}>
        <MapView />
      </Box>
      <WorkspaceSidebar />

      <AnalysisStartDialog />
      <CreateParcelDialog />
    </Box>
  );
}, 'WorkspacePage');
