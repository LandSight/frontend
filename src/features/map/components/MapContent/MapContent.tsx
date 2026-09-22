import { useEffect, useRef } from 'react';
import { Polygon, TileLayer, useMap } from 'react-leaflet';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';
import type { FeatureCollection } from 'geojson';
import L from 'leaflet';

import {
  objectLayerKey,
  objectLayersAtom,
  visibleObjectCategoriesAtom,
} from '#/features/infrastructure/models';
import { layerConfigs } from '#/features/map/constants';
import { drawingPolygonAtom, isDrawingAtom, layerAtom } from '#/features/map/models';
import {
  isCreateParcelDialogOpenAtom,
  parcelsListAtom,
  selectedParcelAtom,
  selectedParcelIdAtom,
} from '#/features/parcels/models/parcels';
import {
  isReportOpenAtom,
  selectedAnalysisIdAtom,
  selectParcel,
} from '#/features/workspace/models';
import { cn } from '#/shared/lib/bem';
import { fromLeafletArray, toLeafletArray } from '#/shared/types/geometry';

import { DrawingControls } from '../DrawingControls';
import { LayerSwitcher } from '../LayerSwitcher';
import { ObjectLayersMenu } from '../ObjectLayersMenu';
import { ZoomControls } from '../ZoomControls';

import { useDrawing } from './hooks/useDrawing';
import { getParcelStyle } from './helpers';

import './MapContent.scss';

const cnMapContent = cn('MapContent');

export const MapContent = reatomComponent(() => {
  const isDrawing = isDrawingAtom();
  const polygonCoordinates = drawingPolygonAtom();
  const parcels = parcelsListAtom();
  const selectedId = selectedParcelIdAtom();
  const selectedParcel = selectedParcelAtom();
  const layer = layerAtom();
  const isReportOpen = isReportOpenAtom();

  const analysisId = selectedAnalysisIdAtom();
  const objectLayers = objectLayersAtom();
  const visibleCategories = analysisId ? (visibleObjectCategoriesAtom()[analysisId] ?? []) : [];
  const layerSignature = visibleCategories
    .map(
      (category) =>
        `${category}:${objectLayers[objectLayerKey(analysisId ?? '', category)] ? 1 : 0}`
    )
    .join(',');

  const visibleParcels =
    isReportOpen && selectedId !== null
      ? parcels.filter((parcel) => parcel.id === selectedId)
      : parcels;

  const map = useMap();
  const fittedFocusKeyRef = useRef<string | null>(null);
  const focusKey = analysisId ?? selectedId;

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
    if (isDrawing || isReportOpen) return;
    wrap(selectParcel(selectedId === id ? null : id));
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => map.invalidateSize(), 0);
    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  useEffect(() => {
    map.invalidateSize();
  }, [map, isReportOpen]);

  useEffect(() => {
    if (focusKey === null || selectedParcel === null) {
      return;
    }
    if (fittedFocusKeyRef.current === focusKey) {
      return;
    }
    const bounds = L.latLngBounds(toLeafletArray(selectedParcel.polygon));
    map.flyToBounds(bounds.pad(1), { animate: true, duration: 1.2, padding: [20, 20] });
    fittedFocusKeyRef.current = focusKey;
  }, [focusKey, selectedParcel, map]);

  useEffect(() => {
    const group = L.layerGroup().addTo(map);

    if (analysisId) {
      visibleCategories.forEach((category) => {
        const collection = objectLayers[objectLayerKey(analysisId, category)];
        if (!collection) return;
        L.geoJSON(collection as unknown as FeatureCollection, {
          pointToLayer: (_feature, latlng) => L.circleMarker(latlng, { radius: 5, weight: 1 }),
          style: { weight: 3 },
        }).addTo(group);
      });
    }

    return () => {
      group.remove();
    };
    // The layer signature tracks which object layers should be present on the map.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, analysisId, layerSignature]);

  const layerConfig = layerConfigs[layer];

  return (
    <div className={cnMapContent()}>
      <TileLayer url={layerConfig.url} attribution={layerConfig.attribution} />

      {!isReportOpen && (
        <div className={cnMapContent('RightTopControls')}>
          <DrawingControls
            undoLastPoint={undoLastPoint}
            clearDrawing={clearDrawing}
            finishDrawing={finishDrawing}
          />
        </div>
      )}

      <div className={cnMapContent('RightControls')}>
        {isReportOpen && <ObjectLayersMenu />}
        <LayerSwitcher />
        <ZoomControls />
      </div>

      {visibleParcels.map((parcel) => (
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
