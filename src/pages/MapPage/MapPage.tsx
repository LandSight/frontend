import React from 'react';
import { Button } from '@mui/material';
import { useAction, useAtom } from '@reatom/react';

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

export const MapPage: React.FC = () => {
  const [isAnalysisDialogOpen] = useAtom(isAnalysisDialogOpenAtom);
  const [analysisName, setAnalysisName] = useAtom(newAnalysisNameAtom);
  const [selectedParcel] = useAtom(selectedParcelAtom);
  const [hasSelected] = useAtom(hasSelectedParcelAtom);
  const [isAnalysisStarted] = useAtom(startAnalysis.ready);

  const [isCreateParcelDialogOpen] = useAtom(isCreateParcelDialogOpenAtom);
  const [newParcelName] = useAtom(newParcelNameAtom);
  const [drawingPolygon] = useAtom(drawingPolygonAtom);
  const [isParcelCreated] = useAtom(createParcel.ready);

  const handleStartAnalysis = useAction(startAnalysis);
  const handleAnalysisDialogOpen = useAction(isAnalysisDialogOpenAtom.open);
  const handleAnalysisDialogClose = useAction(isAnalysisDialogOpenAtom.close);
  const handleCreateParcelDialogClose = useAction(isCreateParcelDialogOpenAtom.close);
  const handleCreateParcelAction = useAction(createParcel);
  const handleUpdateNewParcelName = useAction(newParcelNameAtom.set);
  const handleClearDrawing = useAction(clearDrawingState);

  const handleRunAnalysis = async (data: CreateAnalysisRequest) => {
    await handleStartAnalysis(data);
    handleAnalysisDialogClose();
  };

  const handleCreateParcelSubmit = async () => {
    if (!drawingPolygon) return;
    const request: CreateParcelRequest = {
      name: newParcelName.trim(),
      polygon: drawingPolygon,
    };
    await handleCreateParcelAction(request);
    handleCloseCreateParcelDialog();
  };

  const handleCloseCreateParcelDialog = () => {
    handleCreateParcelDialogClose();
    handleClearDrawing();
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
          onClick={handleAnalysisDialogOpen}
          disabled={!hasSelected}
          size="medium"
        >
          Start analysis
        </Button>
      </div>
      <AnalysisDialog
        open={isAnalysisDialogOpen}
        onClose={handleAnalysisDialogClose}
        selectedParcel={selectedParcel}
        analysisName={analysisName}
        onAnalysisNameChange={setAnalysisName}
        onRunAnalysis={handleRunAnalysis}
        isLoading={!isAnalysisStarted}
      />
      <CreateParcelDialog
        open={isCreateParcelDialogOpen}
        onClose={handleCloseCreateParcelDialog}
        polygon={drawingPolygon}
        name={newParcelName}
        onNameChange={handleUpdateNewParcelName}
        onSubmit={handleCreateParcelSubmit}
        isLoading={!isParcelCreated}
      />
    </div>
  );
};
