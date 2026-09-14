import axios, { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';

import { clearAccessToken, getAccessToken, setAccessToken } from './token';

interface AuthResponse {
  access_token: string;
  token_type: string;
}

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    // Skip refresh logic for auth endpoints to avoid loops.
    const isAuthRequest = config?.url?.includes('/identity/auth/');

    // Try to refresh the access token once and retry the failed request.
    if (config && status === 401 && !config._retried && !isAuthRequest) {
      config._retried = true;
      try {
        const { data } = await axios.post<AuthResponse>(
          '/api/v1/identity/auth/refresh',
          {},
          { withCredentials: true }
        );
        setAccessToken(data.access_token);
        const headers = AxiosHeaders.from(config.headers);
        headers.set('Authorization', `Bearer ${data.access_token}`);
        config.headers = headers;
        return apiClient(config);
      } catch {
        clearAccessToken();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
