import L from 'leaflet';

export type Point = {
  lat: number;
  lng: number;
};

export const toLeaflet = (point: Point): L.LatLng => {
  return L.latLng(point.lat, point.lng);
};

export const toLeafletArray = (points: Point[]): L.LatLng[] => {
  return points.map((p) => L.latLng(p.lat, p.lng));
};

export const fromLeaflet = (latlng: L.LatLng): Point => {
  return {
    lat: latlng.lat,
    lng: latlng.lng,
  };
};

export const fromLeafletArray = (latlngs: L.LatLng[]): Point[] => {
  return latlngs.map((latlng) => ({
    lat: latlng.lat,
    lng: latlng.lng,
  }));
};
