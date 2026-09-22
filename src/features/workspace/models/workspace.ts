import { action, atom, computed } from '@reatom/core';

import { analysesAtom, analysesListAtom } from '#/features/analyses/models/analyses';
import { fetchAnalysisMetricRefs, resetObjectCategories } from '#/features/infrastructure/models';
import { selectedParcelIdAtom } from '#/features/parcels/models';

export type WorkspaceView = 'parcels' | 'analyses';

export const workspaceViewAtom = atom<WorkspaceView>('parcels', 'workspaceViewAtom');
export const selectedAnalysisIdAtom = atom<string | null>(null, 'selectedAnalysisIdAtom');
export const expandedParcelIdsAtom = atom<string[]>([], 'expandedParcelIdsAtom');

export const selectedAnalysisAtom = computed(() => {
  const id = selectedAnalysisIdAtom();
  return id ? (analysesAtom()[id] ?? null) : null;
}, 'selectedAnalysisAtom');

export const isReportOpenAtom = computed(
  () => selectedAnalysisIdAtom() !== null,
  'isReportOpenAtom'
);

export const analysesByParcelAtom = computed(() => {
  const grouped: Record<string, ReturnType<typeof analysesListAtom>> = {};
  analysesListAtom().forEach((analysis) => {
    (grouped[analysis.parcel_id] ??= []).push(analysis);
  });
  return grouped;
}, 'analysesByParcelAtom');

export const closeReport = action(() => {
  const analysisId = selectedAnalysisIdAtom();
  if (analysisId) {
    resetObjectCategories(analysisId);
  }
  selectedAnalysisIdAtom.set(null);
}, 'closeReport');

export const setWorkspaceView = action((view: WorkspaceView) => {
  closeReport();
  workspaceViewAtom.set(view);
}, 'setWorkspaceView');

export const toggleParcelExpanded = action((parcelId: string) => {
  expandedParcelIdsAtom.set((prev) =>
    prev.includes(parcelId) ? prev.filter((id) => id !== parcelId) : [...prev, parcelId]
  );
}, 'toggleParcelExpanded');

export const selectAnalysis = action((id: string) => {
  const analysis = analysesAtom()[id];
  if (!analysis) return;

  const previousId = selectedAnalysisIdAtom();
  if (previousId && previousId !== id) {
    resetObjectCategories(previousId);
  }

  selectedParcelIdAtom.set(analysis.parcel_id);
  selectedAnalysisIdAtom.set(id);
  fetchAnalysisMetricRefs(id);
}, 'selectAnalysis');

export const selectParcel = action((id: string | null) => {
  if (!id) {
    closeReport();
    selectedParcelIdAtom.set(null);
    return;
  }

  const analysis = selectedAnalysisAtom();
  if (analysis && analysis.parcel_id !== id) {
    closeReport();
  }
  selectedParcelIdAtom.set(id);
}, 'selectParcel');
