import { action, atom, withAsyncData } from '@reatom/core';

import { getApiErrorMessage } from '#/shared/api/errors';
import { addNotification } from '#/shared/ui/notification';

import type { InfrastructureFeatureCollection, MetricRef } from '../api/infrastructureApi';
import * as infrastructureApi from '../api/infrastructureApi';

export const infrastructureCategoriesAtom = atom<Record<string, string>>(
  {},
  'infrastructureCategoriesAtom'
);

export const fetchInfrastructureCategories = action(async () => {
  const categories = await infrastructureApi.getInfrastructureCategories();
  const map: Record<string, string> = {};
  categories.forEach((item) => {
    map[item.category] = item.label;
  });
  infrastructureCategoriesAtom.set(map);
}, 'fetchInfrastructureCategories').extend(
  withAsyncData({
    parseError: (error) => {
      const msg = getApiErrorMessage(error, 'Failed to fetch infrastructure categories');
      addNotification(msg, 'error');
      return new Error(msg);
    },
  })
);

export const analysisMetricRefsAtom = atom<Record<string, MetricRef[]>>(
  {},
  'analysisMetricRefsAtom'
);

export const fetchAnalysisMetricRefs = action(async (analysisId: string) => {
  const refs = await infrastructureApi.getAnalysisMetrics(analysisId);
  analysisMetricRefsAtom.set((prev) => ({ ...prev, [analysisId]: refs }));
  return refs;
}, 'fetchAnalysisMetricRefs').extend(
  withAsyncData({
    parseError: (error) => {
      const msg = getApiErrorMessage(error, 'Failed to fetch analysis metrics');
      addNotification(msg, 'error');
      return new Error(msg);
    },
  })
);

export const objectLayersAtom = atom<Record<string, InfrastructureFeatureCollection>>(
  {},
  'objectLayersAtom'
);

export const visibleObjectCategoriesAtom = atom<Record<string, string[]>>(
  {},
  'visibleObjectCategoriesAtom'
);

export const objectLayerKey = (analysisId: string, category: string) => `${analysisId}:${category}`;

export const toggleObjectCategory = action(
  async (analysisId: string, category: string, metricsId: string) => {
    const visible = visibleObjectCategoriesAtom()[analysisId] ?? [];
    const isVisible = visible.includes(category);
    const key = objectLayerKey(analysisId, category);

    if (isVisible) {
      visibleObjectCategoriesAtom.set((prev) => ({
        ...prev,
        [analysisId]: visible.filter((item) => item !== category),
      }));
      objectLayersAtom.set((prev) => {
        const { [key]: _removed, ...rest } = prev;
        return rest;
      });
      return;
    }

    visibleObjectCategoriesAtom.set((prev) => ({
      ...prev,
      [analysisId]: [...visible, category],
    }));

    try {
      const collection = await infrastructureApi.getInfrastructureObjects(category, metricsId);
      objectLayersAtom.set((prev) => ({ ...prev, [key]: collection }));
    } catch (error) {
      visibleObjectCategoriesAtom.set((prev) => ({
        ...prev,
        [analysisId]: (prev[analysisId] ?? []).filter((item) => item !== category),
      }));
      addNotification(getApiErrorMessage(error, 'Failed to load objects'), 'error');
    }
  },
  'toggleObjectCategory'
);

export const resetObjectCategories = action((analysisId: string) => {
  visibleObjectCategoriesAtom.set((prev) => {
    const { [analysisId]: _removed, ...rest } = prev;
    return rest;
  });
  objectLayersAtom.set((prev) =>
    Object.fromEntries(Object.entries(prev).filter(([key]) => !key.startsWith(`${analysisId}:`)))
  );
}, 'resetObjectCategories');

export const enableAllObjectCategories = action(async (analysisId: string) => {
  const refs = analysisMetricRefsAtom()[analysisId] ?? [];
  const categories = refs
    .filter((ref) => ref.category != null)
    .map((ref) => ({ category: ref.category as string, metricsId: ref.metrics_id }));

  for (const { category, metricsId } of categories) {
    const visible = visibleObjectCategoriesAtom()[analysisId] ?? [];
    if (!visible.includes(category)) {
      await toggleObjectCategory(analysisId, category, metricsId);
    }
  }
}, 'enableAllObjectCategories');
