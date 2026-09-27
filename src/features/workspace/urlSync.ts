import { computed } from '@reatom/core';

import { analysesAtom } from '#/features/analyses/models/analyses';
import { isAnalysisFinished } from '#/features/analyses/types';
import { layerAtom, mapViewAtom, type MapViewState } from '#/features/map/models';
import type { LayerType } from '#/features/map/types';
import { selectedParcelIdAtom } from '#/features/parcels/models';

import {
  selectAnalysis,
  selectedAnalysisIdAtom,
  selectParcel,
  setWorkspaceView,
  type WorkspaceView,
  workspaceViewAtom,
} from './models';

type UrlState = {
  view: WorkspaceView;
  parcelId: string | null;
  analysisId: string | null;
  layer: LayerType;
  viewport: MapViewState | null;
};

const urlStateAtom = computed<UrlState>(
  () => ({
    view: workspaceViewAtom(),
    parcelId: selectedParcelIdAtom(),
    analysisId: selectedAnalysisIdAtom(),
    layer: layerAtom(),
    viewport: mapViewAtom(),
  }),
  'urlStateAtom'
);

const isLayerType = (value: string | null): value is LayerType =>
  value === 'osm' || value === 'satellite';

let syncStarted = false;
let urlRestored = false;
let writeEnabled = false;
let pendingAnalysisId: string | null = null;

const writeUrl = (state: UrlState) => {
  if (!writeEnabled) {
    return;
  }

  const params = new URLSearchParams();
  params.set('view', state.view);
  params.set('layer', state.layer);
  if (state.parcelId) {
    params.set('parcel', state.parcelId);
  }
  if (state.analysisId) {
    params.set('analysis', state.analysisId);
  }
  if (state.viewport) {
    params.set('lat', String(state.viewport.center.lat));
    params.set('lng', String(state.viewport.center.lng));
    params.set('zoom', String(state.viewport.zoom));
  }
  window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
};

const selectPendingAnalysis = () => {
  if (pendingAnalysisId === null) {
    return;
  }
  const analysis = analysesAtom()[pendingAnalysisId];
  if (analysis && isAnalysisFinished(analysis.status)) {
    const id = pendingAnalysisId;
    pendingAnalysisId = null;
    selectAnalysis(id);
  }
};

const restoreFromUrl = () => {
  if (urlRestored) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const urlView = params.get('view');
  const urlParcel = params.get('parcel');
  const urlAnalysis = params.get('analysis');
  const urlLayer = params.get('layer');
  const urlLat = params.get('lat');
  const urlLng = params.get('lng');
  const urlZoom = params.get('zoom');

  if (isLayerType(urlLayer)) {
    layerAtom.set(urlLayer);
  }
  if (urlView === 'parcels' || urlView === 'analyses') {
    setWorkspaceView(urlView);
  }
  if (urlLat != null && urlLng != null && urlZoom != null) {
    const lat = Number.parseFloat(urlLat);
    const lng = Number.parseFloat(urlLng);
    const zoom = Number.parseFloat(urlZoom);
    if (Number.isFinite(lat) && Number.isFinite(lng) && Number.isFinite(zoom)) {
      mapViewAtom.set({ center: { lat, lng }, zoom });
    }
  }
  if (urlAnalysis) {
    pendingAnalysisId = urlAnalysis;
    selectPendingAnalysis();
  } else if (urlParcel) {
    selectParcel(urlParcel);
  }

  urlRestored = true;
  writeEnabled = true;
};

export const initWorkspaceUrlSync = () => {
  if (syncStarted) {
    return;
  }
  syncStarted = true;

  restoreFromUrl();
  analysesAtom.subscribe(selectPendingAnalysis);
  urlStateAtom.subscribe(writeUrl);
};
