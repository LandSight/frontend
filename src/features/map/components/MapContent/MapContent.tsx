import { useEffect } from 'react';
import { Polygon, TileLayer, useMap } from 'react-leaflet';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';
import L from 'leaflet';

import { layerConfigs } from '#/features/map/constants';
import { drawingPolygonAtom, isDrawingAtom, layerAtom } from '#/features/map/models';
import {
  isCreateParcelDialogOpenAtom,
  parcelsListAtom,
  selectedParcelAtom,
  selectedParcelIdAtom,
} from '#/features/parcels/models/parcels';
import { cn } from '#/shared/lib/bem';
import { fromLeafletArray, toLeafletArray } from '#/shared/types/geometry';

import { DrawingControls } from '../DrawingControls';
import { LayerSwitcher } from '../LayerSwitcher';
import { ZoomControls } from '../ZoomControls';

import { useDrawing } from './hooks/useDrawing';
import { computeCentroid, getParcelStyle } from './helpers';

import './MapContent.scss';

const cnMapContent = cn('MapContent');

export const MapContent = reatomComponent(() => {
  const isDrawing = isDrawingAtom();
  const polygonCoordinates = drawingPolygonAtom();
  const parcels = parcelsListAtom();
  const selectedId = selectedParcelIdAtom();
  const selectedParcel = selectedParcelAtom();
  const layer = layerAtom();
  const map = useMap();

  const handlePolygonCreated = (latlngs: L.LatLng[]) => {
    const points = fromLeafletArray(latlngs);
    wrap(drawingPolygonAtom.set(points));
    wrap(isDrawingAtom.set(false));
    wrap(isCreateParcelDialogOpenAtom.open());
  };

  const { undoLastPoint, clearDrawing, finishDrawing } = useDrawing({
    enabled: isDrawing,
    onPolygonCreated: handlePolygonCreated,
  });

  const handleParcelClick = (id: string) => {
    if (isDrawing) return;
    wrap(selectedParcelIdAtom.set(selectedId === id ? null : id));
  };

  useEffect(() => {
    if (selectedParcel !== null) {
      const center = computeCentroid(selectedParcel.polygon);
      map.panTo(center, { animate: true, duration: 0.5 });
    }
  }, [selectedParcel, map]);

  const layerConfig = layerConfigs[layer];

  return (
    <div className={cnMapContent()}>
      <TileLayer url={layerConfig.url} attribution={layerConfig.attribution} />

      <div className={cnMapContent('RightControls')}>
        <LayerSwitcher />
        <ZoomControls />
      </div>

      <div className={cnMapContent('LeftControls')}>
        <DrawingControls
          undoLastPoint={undoLastPoint}
          clearDrawing={clearDrawing}
          finishDrawing={finishDrawing}
        />
      </div>

      {parcels.map((parcel) => (
        <Polygon
          key={parcel.id}
          positions={toLeafletArray(parcel.polygon)}
          pathOptions={getParcelStyle(parcel.id, selectedId, isDrawing)}
          eventHandlers={{
            click: () => handleParcelClick(parcel.id),
          }}
        />
      ))}

      {polygonCoordinates && polygonCoordinates.length > 0 && (
        <Polygon
          positions={toLeafletArray(polygonCoordinates)}
          pathOptions={{ color: '#2196f3', weight: 3, fillOpacity: 0.2 }}
        />
      )}
    </div>
  );
}, 'MapContent');
