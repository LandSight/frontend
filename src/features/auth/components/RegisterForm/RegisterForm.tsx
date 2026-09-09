import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import {
  confirmPasswordAtom,
  goToLoginPageAction,
  isPasswordMatchAtom,
  isRegisterFormValidAtom,
  passwordAtom,
  registerAction,
  rememberMeAtom,
  showConfirmPasswordAtom,
  showPasswordAtom,
  usernameAtom,
} from '#/features/auth/';
import { cn } from '#/shared/lib/bem';

import { PasswordStrengthIndicator } from '../PasswordStrengthIndicator';
import { UsernameIndicator } from '../UsernameIndicator';

import './RegisterForm.scss';

const cnRegister = cn('RegisterForm');

export const RegisterForm = reatomComponent(() => {
  const username = usernameAtom();
  const password = passwordAtom();
  const confirmPassword = confirmPasswordAtom();
  const rememberMe = rememberMeAtom();

  const showPassword = showPasswordAtom();
  const showConfirmPassword = showConfirmPasswordAtom();

  const isPasswordMatch = isPasswordMatchAtom();
  const isFormValid = isRegisterFormValidAtom();
  const isLoading = registerAction.status().isPending;

  return (
    <Box component="form" className={cnRegister()}>
      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        align="center"
        className={cnRegister('Title')}
      >
        Create account
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        gutterBottom
        align="center"
        className={cnRegister('Subtitle')}
      >
        Join LandSight to analyze land parcels
      </Typography>

      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => wrap(usernameAtom.set(e.target.value))}
        disabled={isLoading}
        autoComplete="username"
        autoFocus
        required
      />

      <UsernameIndicator />

      <TextField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => wrap(passwordAtom.set(e.target.value))}
        disabled={isLoading}
        autoComplete="new-password"
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => wrap(showPasswordAtom.set(!showPassword))} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <PasswordStrengthIndicator />

      <TextField
        label="Confirm password"
        type={showConfirmPassword ? 'text' : 'password'}
        variant="outlined"
        fullWidth
        margin="normal"
        value={confirmPassword}
        onChange={(e) => wrap(confirmPasswordAtom.set(e.target.value))}
        disabled={isLoading}
        autoComplete="new-password"
        required
        error={confirmPassword.length > 0 && !isPasswordMatch}
        helperText={
          confirmPassword.length > 0 && !isPasswordMatch
            ? 'Passwords do not match'
            : confirmPassword.length > 0 && isPasswordMatch
              ? 'Passwords match'
              : ''
        }
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => wrap(showConfirmPasswordAtom.set(!showConfirmPassword))}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Box className={cnRegister('RememberRow')}>
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={wrap(rememberMeAtom.toggle)}
              disabled={isLoading}
              size="small"
            />
          }
          label="Remember me"
        />
      </Box>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        disabled={!isFormValid || isLoading}
        onClick={wrap(registerAction)}
        className={cnRegister('Submit')}
      >
        {isLoading ? <CircularProgress size={22} color="inherit" /> : 'Sign up'}
      </Button>

      <Typography variant="body2" align="center" className={cnRegister('Footer')}>
        {'Already have an account? '}
        <Typography
          component="a"
          href="#"
          variant="body2"
          className={cnRegister('Link')}
          onClick={wrap(goToLoginPageAction)}
        >
          Sign in
        </Typography>
      </Typography>
    </Box>
  );
}, 'RegisterForm');
