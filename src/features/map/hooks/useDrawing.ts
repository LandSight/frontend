import { useCallback, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet-draw';

interface UseDrawingProps {
  onPolygonCreated: (latlngs: L.LatLng[]) => void;
  enabled: boolean;
}

export const useDrawing = ({ onPolygonCreated, enabled }: UseDrawingProps) => {
  const map = useMap();
  const drawHandlerRef = useRef<L.Draw.Polygon | null>(null);
  const drawnLayerRef = useRef<L.Polygon | null>(null);

  useEffect(() => {
    if (enabled) {
      // @ts-ignore
      const polygonHandler = new L.Draw.Polygon(map);
      polygonHandler.enable();
      drawHandlerRef.current = polygonHandler;
    } else {
      if (drawHandlerRef.current) {
        drawHandlerRef.current.disable();
        drawHandlerRef.current = null;
      }
    }

    return () => {
      if (drawHandlerRef.current) {
        drawHandlerRef.current.disable();
        drawHandlerRef.current = null;
      }
    };
  }, [map, enabled]);

  useEffect(() => {
    const handleDrawCreated = (e: L.LeafletEvent) => {
      const drawEvent = e as unknown as L.DrawEvents.Created;
      if (drawEvent && drawEvent.layer) {
        const layer = drawEvent.layer;
        if (layer instanceof L.Polygon) {
          drawnLayerRef.current = layer;
          const latlngs = layer.getLatLngs();
          const coordinates = latlngs[0] as L.LatLng[];
          onPolygonCreated(coordinates);
        }
      }
    };

    map.on('draw:created', handleDrawCreated);

    return () => {
      map.off('draw:created', handleDrawCreated);
    };
  }, [map, onPolygonCreated]);

  const undoLastPoint = useCallback(() => {
    if (drawHandlerRef.current) {
      drawHandlerRef.current.deleteLastVertex();
    }
  }, []);

  const clearDrawing = useCallback(() => {
    if (drawHandlerRef.current) {
      drawHandlerRef.current.disable();
      drawHandlerRef.current = null;
      // @ts-ignore
      const polygonHandler = new L.Draw.Polygon(map);
      polygonHandler.enable();
      drawHandlerRef.current = polygonHandler;
    }
    if (drawnLayerRef.current) {
      map.removeLayer(drawnLayerRef.current);
      drawnLayerRef.current = null;
    }
  }, [map]);

  const finishDrawing = useCallback(() => {
    if (drawHandlerRef.current) {
      drawHandlerRef.current.completeShape();
    }
  }, []);

  return {
    undoLastPoint,
    clearDrawing,
    finishDrawing,
  };
};
