import { useEffect, useRef } from 'react';
import { wrap } from '@reatom/core';

import { analysesAtom } from '#/features/analyses/models/analyses';
import { selectedParcelIdAtom } from '#/features/parcels/models';

import {
  selectAnalysis,
  selectedAnalysisIdAtom,
  selectParcel,
  setWorkspaceView,
  workspaceViewAtom,
} from '../models';

export const useWorkspaceUrlSync = () => {
  const view = workspaceViewAtom();
  const parcelId = selectedParcelIdAtom();
  const analysisId = selectedAnalysisIdAtom();
  const analyses = analysesAtom();
  const restoredRef = useRef(false);

  useEffect(() => {
    if (restoredRef.current) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const urlView = params.get('view');
    const urlParcel = params.get('parcel');
    const urlAnalysis = params.get('analysis');

    if (urlView === 'parcels' || urlView === 'analyses') {
      wrap(setWorkspaceView(urlView));
    }

    if (urlAnalysis) {
      if (analyses[urlAnalysis]) {
        wrap(selectAnalysis(urlAnalysis));
        restoredRef.current = true;
      }
      return;
    }

    if (urlParcel) {
      wrap(selectParcel(urlParcel));
    }
    restoredRef.current = true;
  }, [analyses]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('view', view);
    if (parcelId) {
      params.set('parcel', parcelId);
    }
    if (analysisId) {
      params.set('analysis', analysisId);
    }
    const query = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
  }, [view, parcelId, analysisId]);
};
