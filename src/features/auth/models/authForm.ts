import type { SyntheticEvent } from 'react';
import { action, atom, computed, withActions, withAsync } from '@reatom/core';

import { loginRoute, registerRoute, workspaceRoute } from '#/app/routes/routes';
import { getRememberMe, setRememberMe } from '#/shared/api/token';
import { addNotification } from '#/shared/ui/notification';

import { login, register } from './auth';

// === Atoms ===
export const usernameAtom = atom('', 'usernameAtom');
export const passwordAtom = atom('', 'passwordAtom');
export const confirmPasswordAtom = atom('', 'confirmPasswordAtom');
export const rememberMeAtom = atom(getRememberMe(), 'rememberMeAtom').extend(
  withActions((target) => ({
    toggle: () => {
      const next = !target();
      target.set(next);
      setRememberMe(next);
    },
  }))
);
export const showPasswordAtom = atom(false, 'showPasswordAtom');
export const showConfirmPasswordAtom = atom(false, 'showConfirmPasswordAtom');

// === Password validation atoms ===
export const isPasswordMinLengthAtom = computed(
  () => passwordAtom().length >= 8,
  'isPasswordMinLengthAtom'
);
export const isPasswordHasUpperCaseAtom = computed(
  () => /[A-Z]/.test(passwordAtom()),
  'isPasswordHasUpperCaseAtom'
);
export const isPasswordHasLowerCaseAtom = computed(
  () => /[a-z]/.test(passwordAtom()),
  'isPasswordHasLowerCaseAtom'
);
export const isPasswordHasNumberAtom = computed(
  () => /[0-9]/.test(passwordAtom()),
  'isPasswordHasNumberAtom'
);
export const isPasswordHasSpecialCharAtom = computed(
  () => /[!@#$%^&*(),.?":{}|<>]/.test(passwordAtom()),
  'isPasswordHasSpecialCharAtom'
);
export const isPasswordValidAtom = computed(() => {
  const minLength = isPasswordMinLengthAtom();
  const hasUpper = isPasswordHasUpperCaseAtom();
  const hasLower = isPasswordHasLowerCaseAtom();
  const hasNumber = isPasswordHasNumberAtom();
  const hasSpecial = isPasswordHasSpecialCharAtom();

  return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
}, 'isPasswordValidAtom');

// === Username validation atoms ===
export const isUsernameMinLengthAtom = computed(
  () => usernameAtom().trim().length >= 3,
  'isUsernameMinLengthAtom'
);
export const isUsernameMaxLengthAtom = computed(
  () => usernameAtom().trim().length <= 50,
  'isUsernameMaxLengthAtom'
);
export const isUsernameValidCharsAtom = computed(
  () => /^[a-zA-Z0-9_-]+$/.test(usernameAtom().trim()),
  'isUsernameValidCharsAtom'
);
export const isUsernameValidAtom = computed(() => {
  const minLength = isUsernameMinLengthAtom();
  const maxLength = isUsernameMaxLengthAtom();
  const validChars = isUsernameValidCharsAtom();
  const trimmed = usernameAtom().trim();

  return trimmed.length > 0 && minLength && maxLength && validChars;
}, 'isUsernameValidAtom');

// === Confirm password atoms ===
export const isPasswordMatchAtom = computed(() => {
  const password = passwordAtom();
  const confirm = confirmPasswordAtom();
  return password === confirm;
}, 'isPasswordMatchAtom');

// === Form validity atoms ===
export const isLoginFormValidAtom = computed(() => {
  const username = usernameAtom();
  const password = passwordAtom();
  return username.trim().length > 0 && password.length > 0;
}, 'isLoginFormValidAtom');
export const isRegisterFormValidAtom = computed(() => {
  const isUsernameValid = isUsernameValidAtom();
  const isPasswordValid = isPasswordValidAtom();
  const isMatch = isPasswordMatchAtom();
  return isUsernameValid && isPasswordValid && isMatch;
}, 'isRegisterFormValidAtom');

// === Actions ===
export const loginAction = action(async (e?: SyntheticEvent) => {
  e?.preventDefault();

  const username = usernameAtom();
  const password = passwordAtom();

  // Frontend validation
  if (!username.trim()) {
    addNotification('Username is required', 'warning');
    return;
  }

  if (password.length <= 0) {
    addNotification('Password is required', 'warning');
    return;
  }

  await login({ username: username.trim(), password });

  // Clear form after successful login
  usernameAtom.set('');
  passwordAtom.set('');

  workspaceRoute.go();
}, 'loginAction').extend(
  withAsync({
    status: true,
  })
);
export const registerAction = action(async (e?: SyntheticEvent) => {
  e?.preventDefault();

  const username = usernameAtom();
  const password = passwordAtom();

  // Frontend validation
  if (!isUsernameValidAtom()) {
    addNotification(
      'Username must be 3-50 characters and contain only letters, numbers, underscores, and hyphens',
      'warning'
    );
    return;
  }

  if (!isPasswordValidAtom()) {
    addNotification(
      'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
      'warning'
    );
    return;
  }

  if (!isPasswordMatchAtom()) {
    addNotification('Passwords do not match', 'warning');
    return;
  }

  await register({ username: username.trim(), password });

  // Clear form after successful registration
  usernameAtom.set('');
  passwordAtom.set('');
  confirmPasswordAtom.set('');

  workspaceRoute.go();
}, 'registerAction').extend(
  withAsync({
    status: true,
  })
);
export const goToRegisterPageAction = action(() => {
  if (!loginAction.status().isPending) {
    registerRoute.go();
  }
}, 'goToRegisterPageAction');
export const goToLoginPageAction = action(() => {
  if (!registerAction.status().isPending) {
    loginRoute.go();
  }
}, 'goToRegisterPageAction');
