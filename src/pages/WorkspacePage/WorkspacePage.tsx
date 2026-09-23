import { useEffect } from 'react';
import { Box } from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomFactoryComponent } from '@reatom/react';

import { AnalysisStartDialog } from '#/features/analyses/components/AnalysisStartDialog';
import { fetchAnalyses } from '#/features/analyses/models';
import { hasActiveAnalysesAtom } from '#/features/analyses/models/analyses';
import { fetchInfrastructureCategories } from '#/features/infrastructure/models';
import { MapView } from '#/features/map/components/MapView';
import { clearDrawingState } from '#/features/map/models';
import { CreateParcelDialog } from '#/features/parcels/components/CreateParcelDialog';
import {
  fetchParcels,
  isCreateParcelDialogOpenAtom,
  newParcelNameAtom,
} from '#/features/parcels/models';
import { WorkspaceSidebar } from '#/features/workspace/components/WorkspaceSidebar';
import { initWorkspaceUrlSync } from '#/features/workspace/urlSync';

const POLL_INTERVAL_MS = 3000;

export const WorkspacePage = reatomFactoryComponent(() => {
  initWorkspaceUrlSync();

  return () => {
    const hasActiveAnalyses = hasActiveAnalysesAtom();

    useEffect(() => {
      fetchParcels();
      fetchAnalyses();
      fetchInfrastructureCategories();
    }, []);

    useEffect(() => {
      if (!hasActiveAnalyses) {
        return;
      }
      const intervalId = setInterval(() => {
        fetchAnalyses();
      }, POLL_INTERVAL_MS);
      return () => {
        clearInterval(intervalId);
      };
    }, [hasActiveAnalyses]);

    const isCreateParcelDialogOpen = isCreateParcelDialogOpenAtom();

    const handleCloseCreateParcelDialog = () => {
      wrap(isCreateParcelDialogOpenAtom.close());
      wrap(clearDrawingState());
      wrap(newParcelNameAtom.reset());
    };

    return (
      <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
        <Box sx={{ flex: 1, position: 'relative', minWidth: 0 }}>
          <MapView />
        </Box>
        <WorkspaceSidebar />

        <AnalysisStartDialog />
        <CreateParcelDialog
          open={isCreateParcelDialogOpen}
          onClose={handleCloseCreateParcelDialog}
        />
      </Box>
    );
  };
}, 'WorkspacePage');
