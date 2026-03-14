export const layerTypes = ['osm', 'satellite'] as const;
export type LayerType = (typeof layerTypes)[number];
export const layerTypeDefault = layerTypes[0];

export type LayerConfig = {
  url: string;
  attribution: string;
  label: string;
  icon: string;
};
