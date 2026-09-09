import { action, atom, computed, withAsyncData } from '@reatom/core';

import { loginRoute } from '#/app/routes';
import { getApiErrorMessage } from '#/shared/api/errors';
import { clearAccessToken, getAccessToken, setAccessToken } from '#/shared/api/token';
import { addNotification } from '#/shared/ui/notification';

import { authApi } from '../api/authApi';
import type { LoginCredentials, RegisterCredentials, User } from '../types';

export type SessionStatus = 'checking' | 'guest' | 'authenticated';

// === Atoms ===
export const accessTokenAtom = atom<string | null>(getAccessToken(), 'accessTokenAtom');
export const userAtom = atom<User | null>(null, 'userAtom');
export const sessionStatusAtom = atom<SessionStatus>('checking', 'sessionStatusAtom');

// === Computed Atoms ===
export const currentUsernameAtom = computed(
  () => userAtom()?.username ?? '',
  'currentUsernameAtom'
);
export const isAuthenticatedAtom = computed(
  () => sessionStatusAtom() === 'authenticated',
  'isAuthenticatedAtom'
);
export const isSessionCheckingAtom = computed(
  () => sessionStatusAtom() === 'checking',
  'isSessionCheckingAtom'
);
export const isGuestAtom = computed(() => sessionStatusAtom() === 'guest', 'isGuestAtom');

// === Actions ===
export const applyTokens = action((accessToken: string) => {
  accessTokenAtom.set(accessToken);
  setAccessToken(accessToken);
  sessionStatusAtom.set('authenticated');
}, 'applyTokens');
export const login = action(async (credentials: LoginCredentials) => {
  const tokens = await authApi.login(credentials);
  applyTokens(tokens.access_token);
  const user = await authApi.getProfile();
  userAtom.set(user);
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
  sessionStatusAtom.set('guest');
  loginRoute.go();
}, 'logout');
export const restoreSession = action(async () => {
  if (!accessTokenAtom()) {
    sessionStatusAtom.set('guest');
    return;
  }

  sessionStatusAtom.set('checking');
  try {
    const user = await authApi.getProfile();
    userAtom.set(user);
    sessionStatusAtom.set('authenticated');
  } catch {
    userAtom.set(null);
    sessionStatusAtom.set('guest');
  }
}, 'restoreSession').extend(
  withAsyncData({
    status: true,
  })
);
