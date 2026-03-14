import React from 'react';
import { Button } from '@mui/material';
import { useAction, useAtom } from '@reatom/react';

import type { CreateAnalysisRequest } from '#/features/analyses/api/analysesApi';
import { AnalysisDialog } from '#/features/analyses/components/AnalysisDialog';
import {
  analysisTypeAtom,
  createAnalysis,
  isFormOpenAtom,
  isLoadingAtom as analysisLoadingAtom,
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
  isCreatingAtom,
  newParcelNameAtom,
  selectedParcelAtom,
} from '#/features/parcels/models';
import { cn } from '#/shared/lib/bem';

import './MapPage.scss';

const cnMapPage = cn('MapPage');

export const MapPage: React.FC = () => {
  const [isFormOpen, setFormOpen] = useAtom(isFormOpenAtom);
  const [analysisType, setAnalysisType] = useAtom(analysisTypeAtom);
  const [selectedParcel] = useAtom(selectedParcelAtom);
  const [hasSelected] = useAtom(hasSelectedParcelAtom);
  const [analysisLoading] = useAtom(analysisLoadingAtom);
  const handleCreateAnalysis = useAction(createAnalysis);

  const [isCreateParcelDialogOpen, setIsCreateParcelDialogOpen] = useAtom(
    isCreateParcelDialogOpenAtom
  );
  const [newParcelName, setNewParcelName] = useAtom(newParcelNameAtom);
  const [drawingPolygon] = useAtom(drawingPolygonAtom);
  const [parcelsCreating] = useAtom(isCreatingAtom);
  const handleCreateParcelAction = useAction(createParcel);
  const handleClearDrawing = useAction(clearDrawingState);

  const handleOpenAnalysisDialog = () => {
    setFormOpen(true);
  };

  const handleCloseAnalysisDialog = () => {
    setFormOpen(false);
  };

  const handleRunAnalysis = async (data: CreateAnalysisRequest) => {
    await handleCreateAnalysis(data);
    handleCloseAnalysisDialog();
  };

  const handleCreateParcelSubmit = async () => {
    if (!drawingPolygon) return;
    const request: CreateParcelRequest = {
      name: newParcelName.trim() || 'Unnamed Parcel',
      polygon: drawingPolygon,
    };
    await handleCreateParcelAction(request);
    setIsCreateParcelDialogOpen(false);
    setNewParcelName('');
    handleClearDrawing();
  };

  const handleCloseCreateParcelDialogWithClear = () => {
    setIsCreateParcelDialogOpen(false);
    setNewParcelName('');
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
          onClick={handleOpenAnalysisDialog}
          disabled={!hasSelected}
          size="medium"
        >
          Start analysis
        </Button>
      </div>
      <AnalysisDialog
        open={isFormOpen}
        onClose={handleCloseAnalysisDialog}
        selectedParcel={selectedParcel}
        analysisType={analysisType}
        onAnalysisTypeChange={setAnalysisType}
        onRunAnalysis={handleRunAnalysis}
        isLoading={analysisLoading}
      />
      <CreateParcelDialog
        open={isCreateParcelDialogOpen}
        onClose={handleCloseCreateParcelDialogWithClear}
        polygon={drawingPolygon}
        name={newParcelName}
        onNameChange={setNewParcelName}
        onSubmit={handleCreateParcelSubmit}
        isLoading={parcelsCreating}
      />
    </div>
  );
};
