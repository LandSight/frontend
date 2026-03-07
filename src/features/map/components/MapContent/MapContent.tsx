import React, { useState } from 'react';
import { Polygon, TileLayer } from 'react-leaflet';
import L from 'leaflet';

import { useAppDispatch, useAppSelector } from '#/app/store/hooks';
import { setIsDrawing, setPolygon } from '#/app/store/slices/polygon';
import { cn } from '#/shared/lib/bem';
import { fromLeafletArray, toLeafletArray } from '#/shared/types/geometry';

import { useDrawing } from '../../hooks/useDrawing';
import { AnalysisButton } from '../AnalysisButton/AnalysisButton';
import { DrawingControls } from '../DrawingControls/DrawingControls';
import { LayerSwitcher } from '../LayerSwitcher/LayerSwitcher';
import { ZoomControls } from '../ZoomControls/ZoomControls';

import './MapContent.scss';

const cnMapContent = cn('MapContent');

interface MapContentProps {
  onOpenAnalysisDialog?: () => void;
}

export const MapContent: React.FC<MapContentProps> = ({ onOpenAnalysisDialog }) => {
  const dispatch = useAppDispatch();
  const isDrawing = useAppSelector((state) => state.polygon.isDrawing);
  const polygonCoordinates = useAppSelector((state) => state.polygon.coordinates);
  const [layer, setLayer] = useState<'osm' | 'satellite'>('osm');

  const handlePolygonCreated = (latlngs: L.LatLng[]) => {
    const points = fromLeafletArray(latlngs);
    dispatch(setPolygon(points));
    dispatch(setIsDrawing(false));
  };

  const { undoLastPoint, clearDrawing, finishDrawing } = useDrawing({
    enabled: isDrawing,
    onPolygonCreated: handlePolygonCreated,
  });

  return (
    <div className={cnMapContent()}>
      <TileLayer
        url={
          layer === 'osm'
            ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        }
        attribution={layer === 'osm' ? '&copy; OpenStreetMap contributors' : 'Tiles &copy; Esri'}
      />

      <div className={cnMapContent('RightControls')}>
        <LayerSwitcher layer={layer} onLayerChange={setLayer} />
        <ZoomControls />
      </div>

      <div className={cnMapContent('LeftControls')}>
        <DrawingControls
          undoLastPoint={undoLastPoint}
          clearDrawing={clearDrawing}
          finishDrawing={finishDrawing}
        />
        {onOpenAnalysisDialog && <AnalysisButton onClick={onOpenAnalysisDialog} />}
      </div>

      {polygonCoordinates && polygonCoordinates.length > 0 && (
        <Polygon
          positions={toLeafletArray(polygonCoordinates)}
          pathOptions={{ color: '#2196f3', weight: 3, fillOpacity: 0.2 }}
        />
      )}
    </div>
  );
};
