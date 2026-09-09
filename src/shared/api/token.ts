const ACCESS_TOKEN_KEY = 'landsight_access_token';
const REMEMBER_ME_KEY = 'landsight_remember_me';

export const getRememberMe = (): boolean => {
  return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
};

export const setRememberMe = (remember: boolean): void => {
  localStorage.setItem(REMEMBER_ME_KEY, String(remember));
};

export const getAccessToken = (): string | null => {
  const storage = getRememberMe() ? localStorage : sessionStorage;
  return storage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token: string): void => {
  const storage = getRememberMe() ? localStorage : sessionStorage;
  storage.setItem(ACCESS_TOKEN_KEY, token);
};

export const clearAccessToken = (): void => {
  const storage = getRememberMe() ? localStorage : sessionStorage;
  storage.removeItem(ACCESS_TOKEN_KEY);
};
