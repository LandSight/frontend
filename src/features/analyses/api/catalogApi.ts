import { abortVar, action } from '@reatom/core';

import type { Engine, Profile } from '#/features/analyses/types';
import apiClient from '#/shared/api/client';

export const getProfiles = action(async (): Promise<Profile[]> => {
  const controller = new AbortController();
  abortVar.subscribe(() => controller.abort());
  const response = await apiClient.get<{ profiles: Profile[] }>('/profiles', {
    signal: controller.signal,
  });
  return response.data.profiles;
}, 'getProfiles');

export const getEngines = action(async (): Promise<Engine[]> => {
  const controller = new AbortController();
  abortVar.subscribe(() => controller.abort());
  const response = await apiClient.get<{ engines: Engine[] }>('/engines', {
    signal: controller.signal,
  });
  return response.data.engines;
}, 'getEngines');
