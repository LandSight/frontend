import { action, atom, computed, withAsyncData } from '@reatom/core';

import { loginRoute, mapRoute } from '#/app/routes/routes';
import { getApiErrorMessage } from '#/shared/api/errors';
import { clearAccessToken, getAccessToken, setAccessToken } from '#/shared/api/token';
import { addNotification } from '#/shared/ui/notification';

import { authApi } from '../api/authApi';
import type { LoginCredentials, RegisterCredentials, User } from '../types';

// === Atoms ===
export const accessTokenAtom = atom<string | null>(getAccessToken(), 'accessTokenAtom');
export const userAtom = atom<User | null>(null, 'userAtom');

export const currentUsernameAtom = computed(
  () => userAtom()?.username ?? '',
  'currentUsernameAtom'
);

export const applyTokens = action((accessToken: string) => {
  accessTokenAtom.set(accessToken);
  setAccessToken(accessToken);
}, 'applyTokens');

export const login = action(async (credentials: LoginCredentials) => {
  const tokens = await authApi.login(credentials);
  applyTokens(tokens.access_token);
  const user = await authApi.getProfile();
  userAtom.set(user);
  mapRoute.go();
  return user;
}, 'login').extend(
  withAsyncData({
    parseError: (error) => {
      const msg = getApiErrorMessage(error, 'Login failed. Please try again.');
      addNotification(`Login failed: ${msg}`, 'error');
      return new Error(msg);
    },
  })
);

export const register = action(async (credentials: RegisterCredentials) => {
  await authApi.register(credentials);
  addNotification(`User "${credentials.username}" registered. Signing in...`, 'success');
  return login(credentials);
}, 'register').extend(
  withAsyncData({
    parseError: (error) => {
      const msg = getApiErrorMessage(error, 'Registration failed. Please try again.');
      addNotification(`Registration failed: ${msg}`, 'error');
      return new Error(msg);
    },
  })
);

export const logout = action(() => {
  clearAccessToken();
  accessTokenAtom.set(null);
  userAtom.set(null);
  loginRoute.go();
}, 'logout');

export const restoreSession = action(async () => {
  if (!accessTokenAtom()) {
    return;
  }
  try {
    const user = await authApi.getProfile();
    userAtom.set(user);
  } catch {
    // Access token is expired/invalid — try to refresh using the httpOnly cookie.
    try {
      const tokens = await authApi.refresh();
      applyTokens(tokens.access_token);
      const user = await authApi.getProfile();
      userAtom.set(user);
    } catch {
      clearAccessToken();
      accessTokenAtom.set(null);
      userAtom.set(null);
    }
  }
}, 'restoreSession');
