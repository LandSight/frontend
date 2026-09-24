import { action, atom, computed, withActions, withAsyncData } from '@reatom/core';

import { selectedParcelIdAtom } from '#/features/parcels/models';
import { getApiErrorMessage } from '#/shared/api/errors';
import { addNotification } from '#/shared/ui/notification';

import type { CreateAnalysisRequest } from '../api/analysesApi';
import * as analysisApi from '../api/analysesApi';
import type { AnalysesFilters, Analysis, AnalysisStatus, SortBy, SortOrder } from '../types';

// === Atoms ===
export const analysesAtom = atom<Record<string, Analysis>>({}, 'analysesAtom');
export const newAnalysisNameAtom = atom('', 'newAnalysisNameAtom').extend(
  withActions((target) => ({
    reset: () => target.set(''),
  }))
);
export const isAnalysisDialogOpenAtom = atom(false, 'isAnalysisDialogOpenAtom').extend(
  withActions((target) => ({
    open: () => target.set(true),
    close: () => target.set(false),
  }))
);
export const analysisParcelIdAtom = atom<string | null>(null, 'analysisParcelIdAtom');

export const openAnalysisDialog = action((parcelId?: string | null) => {
  analysisParcelIdAtom.set(parcelId ?? selectedParcelIdAtom());
  isAnalysisDialogOpenAtom.open();
}, 'openAnalysisDialog');

// === Analysis name validation atoms ===
export const isAnalysisNameMinLengthAtom = computed(
  () => newAnalysisNameAtom().trim().length >= 3,
  'isAnalysisNameMinLengthAtom'
);
export const isAnalysisNameMaxLengthAtom = computed(
  () => newAnalysisNameAtom().trim().length <= 64,
  'isAnalysisNameMaxLengthAtom'
);
export const isAnalysisNameStartsWithLetterAtom = computed(
  () => /^[A-Za-z]/.test(newAnalysisNameAtom().trim()),
  'isAnalysisNameStartsWithLetterAtom'
);
export const isAnalysisNameValidCharsAtom = computed(
  () => /^[A-Za-z][A-Za-z0-9 _-]*$/.test(newAnalysisNameAtom().trim()),
  'isAnalysisNameValidCharsAtom'
);
export const isAnalysisNameValidAtom = computed(() => {
  const trimmed = newAnalysisNameAtom().trim();
  return (
    trimmed.length > 0 &&
    isAnalysisNameMinLengthAtom() &&
    isAnalysisNameMaxLengthAtom() &&
    isAnalysisNameValidCharsAtom()
  );
}, 'isAnalysisNameValidAtom');
export const analysisNameErrorAtom = computed(() => {
  const trimmed = newAnalysisNameAtom().trim();
  if (trimmed.length === 0) {
    return '';
  }
  if (!isAnalysisNameMinLengthAtom()) {
    return 'Name must be at least 3 characters';
  }
  if (!isAnalysisNameMaxLengthAtom()) {
    return 'Name must be at most 64 characters';
  }
  if (!isAnalysisNameStartsWithLetterAtom() || !isAnalysisNameValidCharsAtom()) {
    return 'Name must start with a letter and contain only letters, digits, spaces, hyphens, and underscores';
  }
  return '';
}, 'analysisNameErrorAtom');
export const filtersAtom = atom<AnalysesFilters>(
  {
    search: '',
    statuses: [],
    parcelId: null,
    sortBy: 'created_at',
    sortOrder: 'desc',
  },
  'filtersAtom'
).extend(
  withActions((target) => ({
    setSearch: (search: string) => target.set((prev) => ({ ...prev, search })),
    setStatuses: (statuses: AnalysisStatus[]) => target.set((prev) => ({ ...prev, statuses })),
    setParcelId: (parcelId: string | null) => target.set((prev) => ({ ...prev, parcelId })),
    setSortBy: (sortBy: SortBy) => target.set((prev) => ({ ...prev, sortBy })),
    setSortOrder: (sortOrder: SortOrder) => target.set((prev) => ({ ...prev, sortOrder })),
    setPartial: (partial: Partial<AnalysesFilters>) =>
      target.set((prev) => ({ ...prev, ...partial })),
  }))
);

// === Computed atoms ===
export const analysesListAtom = computed(() => {
  const analyses = analysesAtom();
  return Object.values(analyses).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}, 'analysesListAtom');

export const hasActiveAnalysesAtom = computed(
  () => analysesListAtom().some((a) => a.status === 'pending' || a.status === 'running'),
  'hasActiveAnalysesAtom'
);

export const filteredAnalysesAtom = computed(() => {
  const list = analysesListAtom();
  const filters = filtersAtom();

  let filtered = list;

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (analysis) =>
        analysis.parcel_name?.toLowerCase().includes(searchLower) ||
        analysis.name?.toLowerCase().includes(searchLower)
    );
  }

  if (filters.statuses.length > 0) {
    filtered = filtered.filter((analysis) => filters.statuses.includes(analysis.status));
  }

  if (filters.parcelId) {
    filtered = filtered.filter((analysis) => analysis.parcel_id === filters.parcelId);
  }

  filtered = [...filtered].sort((a, b) => {
    let aValue: number | string = 0;
    let bValue: number | string = 0;

    if (filters.sortBy === 'created_at') {
      aValue = new Date(a.created_at).getTime();
      bValue = new Date(b.created_at).getTime();
    } else if (filters.sortBy === 'score') {
      aValue = a.score ?? -Infinity;
      bValue = b.score ?? -Infinity;
    } else if (filters.sortBy === 'parcel_name') {
      aValue = a.parcel_name?.toLowerCase() ?? '';
      bValue = b.parcel_name?.toLowerCase() ?? '';
    } else if (filters.sortBy === 'name') {
      aValue = a.name?.toLowerCase() ?? '';
      bValue = b.name?.toLowerCase() ?? '';
    } else if (filters.sortBy === 'status') {
      aValue = a.status;
      bValue = b.status;
    }

    if (filters.sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return filtered;
}, 'filteredAnalysesAtom');

// === Actions ===
export const fetchAnalyses = action(async () => {
  const analyses = await analysisApi.getAllAnalyses();
  const map: Record<string, Analysis> = {};
  analyses.forEach((analysis) => {
    map[analysis.id] = analysis;
  });
  analysesAtom.set(map);
}, 'fetchAnalyses').extend(
  withAsyncData({
    status: true,
    parseError: (error) => {
      const msg = getApiErrorMessage(error, 'Failed to fetch all analyses');
      addNotification(msg, 'error');
      return new Error(msg);
    },
  })
);

export const startAnalysis = action(async (data: CreateAnalysisRequest) => {
  const newAnalysis = await analysisApi.startAnalysis(data);
  analysesAtom.set((prev) => ({ ...prev, [newAnalysis.id]: newAnalysis }));
  newAnalysisNameAtom.reset();
  addNotification('Analysis started successfully', 'success');
  return newAnalysis;
}, 'startAnalysis').extend(
  withAsyncData({
    status: true,
    parseError: (error) => {
      const msg = getApiErrorMessage(error, 'Failed to start analysis');
      addNotification(msg, 'error');
      return new Error(msg);
    },
  })
);

export const runAnalysis = action(async () => {
  const parcelId = analysisParcelIdAtom();
  const name = newAnalysisNameAtom().trim();

  if (!parcelId || !isAnalysisNameValidAtom()) {
    addNotification(analysisNameErrorAtom() || 'Select a parcel and enter a valid name', 'warning');
    return;
  }

  try {
    await startAnalysis({ name, parcel_id: parcelId });
    isAnalysisDialogOpenAtom.close();
  } catch {
    // Errors are already surfaced by the startAnalysis error handler.
  }
}, 'runAnalysis');

export const deleteAnalysis = action(async (id: string) => {
  await analysisApi.deleteAnalysis(id);
  analysesAtom.set((prev) => {
    const { [id]: _, ...rest } = prev;
    return rest;
  });
  addNotification('Analysis deleted successfully', 'success');
}, 'deleteAnalysis').extend(
  withAsyncData({
    status: true,
    parseError: (error) => {
      const msg = getApiErrorMessage(error, 'Failed to delete analysis');
      addNotification(msg, 'error');
      return new Error(msg);
    },
  })
);

export const pendingDeleteAnalysisIdAtom = atom<string | null>(null, 'pendingDeleteAnalysisIdAtom');

export const requestDeleteAnalysis = action((analysisId: string) => {
  pendingDeleteAnalysisIdAtom.set(analysisId);
}, 'requestDeleteAnalysis');

export const cancelDeleteAnalysis = action(() => {
  pendingDeleteAnalysisIdAtom.set(null);
}, 'cancelDeleteAnalysis');

export const confirmDeleteAnalysis = action(async () => {
  const analysisId = pendingDeleteAnalysisIdAtom();
  if (!analysisId) {
    return;
  }
  await deleteAnalysis(analysisId);
  pendingDeleteAnalysisIdAtom.set(null);
}, 'confirmDeleteAnalysis');
