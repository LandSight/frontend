import React, { useState } from 'react';

import { AnalysisDialog } from '#/features/analysis/components/AnalysisDialog/AnalysisDialog';
import { MapView } from '#/features/map/components/MapView';

import './MapPage.scss';

const MapPage: React.FC = () => {
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);

  const handleOpenAnalysisDialog = () => {
    setAnalysisDialogOpen(true);
  };

  const handleCloseAnalysisDialog = () => {
    setAnalysisDialogOpen(false);
  };

  return (
    <div className={'map-page'}>
      <MapView onOpenAnalysisDialog={handleOpenAnalysisDialog} />

      <AnalysisDialog open={analysisDialogOpen} onClose={handleCloseAnalysisDialog} />
    </div>
  );
};

export default MapPage;
