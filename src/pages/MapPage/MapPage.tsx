import { Button } from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import { AnalysisDialog } from '#/features/analyses/components/AnalysisDialog';
import { isAnalysisDialogOpenAtom } from '#/features/analyses/models';
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
} from '#/features/parcels/models';
import { cn } from '#/shared/lib/bem';

import './MapPage.scss';

const cnMapPage = cn('MapPage');

export const MapPage = reatomComponent(() => {
  const hasSelected = hasSelectedParcelAtom();

  const isCreateParcelDialogOpen = isCreateParcelDialogOpenAtom();
  const newParcelName = newParcelNameAtom();
  const drawingPolygon = drawingPolygonAtom();
  const isParcelCreating = createParcel.status().isPending;

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
      <AnalysisDialog />
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
