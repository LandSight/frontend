import { Button } from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import type { CreateAnalysisRequest } from '#/features/analyses/api/analysesApi';
import { AnalysisDialog } from '#/features/analyses/components/AnalysisDialog';
import {
  isAnalysisDialogOpenAtom,
  newAnalysisNameAtom,
  startAnalysis,
} from '#/features/analyses/models';
import { MapView } from '#/features/map/components/MapView';
import { clearDrawingState, drawingPolygonAtom } from '#/features/map/models';
import type { CreateParcelRequest } from '#/features/parcels/api/parcelsApi';
import { CreateParcelDialog } from '#/features/parcels/components/CreateParcelDialog';
import { ParcelListContainer as ParcelsList } from '#/features/parcels/components/ParcelListContainer';
import {
  createParcel,
  hasSelectedParcelAtom,
  isCreateParcelDialogOpenAtom,
  newParcelNameAtom,
  selectedParcelAtom,
} from '#/features/parcels/models';
import { cn } from '#/shared/lib/bem';

import './MapPage.scss';

const cnMapPage = cn('MapPage');

export const MapPage = reatomComponent(() => {
  const isAnalysisDialogOpen = isAnalysisDialogOpenAtom();
  const analysisName = newAnalysisNameAtom();
  const selectedParcel = selectedParcelAtom();
  const hasSelected = hasSelectedParcelAtom();
  const isAnalysisStarting = startAnalysis.status().isPending;

  const isCreateParcelDialogOpen = isCreateParcelDialogOpenAtom();
  const newParcelName = newParcelNameAtom();
  const drawingPolygon = drawingPolygonAtom();
  const isParcelCreating = createParcel.status().isPending;

  const handleRunAnalysis = async (data: CreateAnalysisRequest) => {
    await startAnalysis(data);
    wrap(isAnalysisDialogOpenAtom.close());
  };

  const handleCreateParcelSubmit = async () => {
    if (!drawingPolygon) return;
    const request: CreateParcelRequest = {
      name: newParcelName.trim(),
      polygon: drawingPolygon,
    };
    await createParcel(request);
    handleCloseCreateParcelDialog();
  };

  const handleCloseCreateParcelDialog = () => {
    wrap(isCreateParcelDialogOpenAtom.close());
    wrap(clearDrawingState());
  };

  return (
    <div className={cnMapPage()}>
      <div className={cnMapPage('MapContainer')}>
        <MapView />
      </div>
      <div className={cnMapPage('RightSidebar')}>
        <h3 className={cnMapPage('RightSidebarTitle')}>My parcels</h3>
        <ParcelsList />
        <Button
          variant="contained"
          color="primary"
          onClick={wrap(isAnalysisDialogOpenAtom.open)}
          disabled={!hasSelected}
          size="medium"
        >
          Start analysis
        </Button>
      </div>
      <AnalysisDialog
        open={isAnalysisDialogOpen}
        onClose={wrap(isAnalysisDialogOpenAtom.close)}
        selectedParcel={selectedParcel}
        analysisName={analysisName}
        onAnalysisNameChange={(newName: string) => wrap(newAnalysisNameAtom.set(newName))}
        onRunAnalysis={handleRunAnalysis}
        isLoading={isAnalysisStarting}
      />
      <CreateParcelDialog
        open={isCreateParcelDialogOpen}
        onClose={handleCloseCreateParcelDialog}
        polygon={drawingPolygon}
        name={newParcelName}
        onNameChange={wrap(newParcelNameAtom.set)}
        onSubmit={handleCreateParcelSubmit}
        isLoading={isParcelCreating}
      />
    </div>
  );
}, 'MapPage');
