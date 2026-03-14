import type { LayerConfig, LayerType } from './types';

export const layerConfigs: Record<LayerType, LayerConfig> = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    label: 'Scheme',
    icon: 'map',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    label: 'Satellite',
    icon: 'satellite',
  },
};
