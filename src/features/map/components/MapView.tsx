import React from 'react';
import { MapContainer } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import { cn } from '#/shared/lib/bem';

import { MapContent } from './MapContent/MapContent';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import './MapView.scss';

L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

const cnMapView = cn('MapView');

interface MapViewProps {
  onOpenAnalysisDialog?: () => void;
}

export const MapView: React.FC<MapViewProps> = ({ onOpenAnalysisDialog }) => {
  return (
    <div className={cnMapView()}>
      <MapContainer
        center={[59.93, 30.31]}
        zoom={12}
        zoomControl={false}
        doubleClickZoom={false}
        attributionControl={false}
        className={cnMapView('MapContainer')}
      >
        <MapContent onOpenAnalysisDialog={onOpenAnalysisDialog} />
      </MapContainer>
    </div>
  );
};
