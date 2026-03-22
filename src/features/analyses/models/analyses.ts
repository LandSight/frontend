import { action, atom, computed, withActions, withAsyncData } from '@reatom/core';

import { addNotification } from '#/shared/ui/notification';

import type { CreateAnalysisRequest, FetchAnalysesParams } from '../api/analysesApi';
import { analysesApi } from '../api/analysesApi';
import { mockAnalyses } from '../mocks/analyses';
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
export const filtersAtom = atom<AnalysesFilters>(
  {
    search: '',
    statuses: [],
    sortBy: 'created_at',
    sortOrder: 'desc',
  },
  'filtersAtom'
).extend(
  withActions((target) => ({
    setSearch: (search: string) => target.set((prev) => ({ ...prev, search })),
    setStatuses: (statuses: AnalysisStatus[]) => target.set((prev) => ({ ...prev, statuses })),
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
export const fetchAnalyses = action(async (params?: FetchAnalysesParams) => {
  const analyses = await analysesApi.fetchAll(params);
  const map: Record<string, Analysis> = {};
  analyses.forEach((analysis) => {
    map[analysis.id] = analysis;
  });
  analysesAtom.set(map);
}, 'fetchAnalyses').extend(
  withAsyncData({
    parseError: (error) => {
      if (import.meta.env.DEV) {
        const map: Record<string, Analysis> = {};
        mockAnalyses.forEach((analysis) => {
          map[analysis.id] = analysis;
        });
        analysesAtom.set(map);
        addNotification('Using demo data (API unavailable)', 'info');
      } else {
        const msg =
          error instanceof Error
            ? `Failed to fetch all analyses': ${error.message}`
            : 'Failed to fetch all analyses';
        addNotification(msg, 'error');
        return new Error(msg);
      }
    },
  })
);

export const startAnalysis = action(async (data: CreateAnalysisRequest) => {
  const newAnalysis = await analysesApi.start(data);
  analysesAtom.set((prev) => ({ ...prev, [newAnalysis.id]: newAnalysis as Analysis }));
  newAnalysisNameAtom.reset();
  addNotification('Analysis started successfully', 'success');
  return newAnalysis;
}, 'startAnalysis').extend(
  withAsyncData({
    parseError: (error) => {
      const msg =
        error instanceof Error
          ? `Failed to start analysis: ${error.message}`
          : 'Failed to start analysis';
      addNotification(msg, 'error');
      return new Error(msg);
    },
  })
);

export const deleteAnalysis = action(async (id: string) => {
  await analysesApi.delete(id);
  analysesAtom.set((prev) => {
    const { [id]: _, ...rest } = prev;
    return rest;
  });
  addNotification('Analysis deleted successfully', 'success');
}, 'deleteAnalysis').extend(
  withAsyncData({
    parseError: (error) => {
      const msg =
        error instanceof Error
          ? `Failed to delete analysis: ${error.message}`
          : 'Failed to delete analysis';
      addNotification(msg, 'error');
      return new Error(msg);
    },
  })
);

export const exportMetrics = action(async (id: string, format: 'json' | 'csv' = 'json') => {
  const blob = await analysesApi.exportMetrics(id, format);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `analysis_${id}_metrics.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  addNotification('Metrics exported successfully', 'success');
}, 'exportMetrics').extend(
  withAsyncData({
    parseError: (error) => {
      const msg =
        error instanceof Error
          ? `Failed to export metrics: ${error.message}`
          : 'Failed to export metrics';
      addNotification(msg, 'error');
      return new Error(msg);
    },
  })
);
