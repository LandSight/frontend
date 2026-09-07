import apiClient from '#/shared/api/client';

import type { AuthTokens, LoginCredentials, RegisterCredentials, User } from '../types';

export const authApi = {
  register: async (data: RegisterCredentials): Promise<User> => {
    const response = await apiClient.post<User>('/identity/auth/register', data);
    return response.data;
  },

  login: async (data: LoginCredentials): Promise<AuthTokens> => {
    const response = await apiClient.post<AuthTokens>('/identity/auth/login', data);
    return response.data;
  },

  refresh: async (): Promise<AuthTokens> => {
    const response = await apiClient.post<AuthTokens>('/identity/auth/refresh', undefined, {
      withCredentials: true,
    });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/identity/users/profile');
    return response.data;
  },
};
