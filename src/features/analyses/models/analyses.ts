import { action, atom, computed } from '@reatom/core';

import { addNotification } from '#/shared/ui/notification';

import type { CreateAnalysisRequest, FetchAnalysesParams } from '../api/analysesApi';
import { analysesApi } from '../api/analysesApi';
import { mockAnalyses } from '../mocks/analyses';
import type { Analysis, AnalysisStatus, AnalysisType, SortBy, SortOrder } from '../types';

export const analysesAtom = atom<Record<string, Analysis>>({});

export const analysesListAtom = computed(() => {
  const analyses = analysesAtom();
  return Object.values(analyses).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
});

export type Filters = {
  search: string;
  types: AnalysisType[];
  statuses: AnalysisStatus[];
  sortBy: SortBy;
  sortOrder: SortOrder;
};

export const filtersAtom = atom<Filters>({
  search: '',
  types: [],
  statuses: [],
  sortBy: 'created_at',
  sortOrder: 'desc',
});

export const filteredAnalysesAtom = computed(() => {
  const list = analysesListAtom();
  const filters = filtersAtom();

  let filtered = list;

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter((analysis) =>
      analysis.parcel_name?.toLowerCase().includes(searchLower)
    );
  }

  if (filters.types.length > 0) {
    filtered = filtered.filter((analysis) => filters.types.includes(analysis.type));
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
    }

    if (filters.sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return filtered;
});

export const isLoadingAtom = atom(false);
export const errorAtom = atom<string | null>(null);

errorAtom.subscribe((error) => {
  if (error) {
    addNotification(error, 'error');
  }
});

export const fetchAnalyses = action(async (params?: FetchAnalysesParams) => {
  isLoadingAtom.set(true);
  errorAtom.set(null);

  try {
    const analyses = await analysesApi.fetchAll(params);
    const byId: Record<string, Analysis> = {};
    analyses.forEach((analysis) => {
      byId[analysis.id] = analysis;
    });
    analysesAtom.set(byId);
  } catch (err) {
    // In development, fallback to mock data
    if (import.meta.env.DEV) {
      const byId: Record<string, Analysis> = {};
      mockAnalyses.forEach((analysis) => {
        byId[analysis.id] = analysis;
      });
      analysesAtom.set(byId);
      addNotification('Using demo data (API unavailable)', 'info');
    } else {
      const msg = err instanceof Error ? err.message : 'Failed to fetch analyses';
      errorAtom.set(msg);
      throw err;
    }
  } finally {
    isLoadingAtom.set(false);
  }
});

export const createAnalysis = action(async (data: CreateAnalysisRequest) => {
  isLoadingAtom.set(true);
  errorAtom.set(null);

  try {
    const newAnalysis = await analysesApi.create(data);
    analysesAtom.set((prev) => ({ ...prev, [newAnalysis.id]: newAnalysis as Analysis }));
    addNotification('Analysis started successfully', 'success');
    return newAnalysis;
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create analysis';
    errorAtom.set(msg);
    throw err;
  } finally {
    isLoadingAtom.set(false);
  }
});

export const deleteAnalysis = action(async (id: string) => {
  isLoadingAtom.set(true);
  errorAtom.set(null);

  try {
    await analysesApi.delete(id);
    analysesAtom.set((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    addNotification('Analysis deleted successfully', 'success');
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to delete analysis';
    errorAtom.set(msg);
    throw err;
  } finally {
    isLoadingAtom.set(false);
  }
});

export const exportMetrics = action(async (id: string, format: 'json' | 'csv' = 'json') => {
  try {
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
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to export metrics';
    addNotification(msg, 'error');
    throw err;
  }
});

export const setFilters = action((filters: Partial<Filters>) => {
  filtersAtom.set((prev) => ({ ...prev, ...filters }));
});
