import React from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { wrap } from '@reatom/core';
import { useAction, useAtom } from '@reatom/react';

import { loginRoute } from '#/app/routes/routes';
import {
  confirmPasswordAtom,
  isPasswordMatchAtom,
  isRegisterFormValidAtom,
  passwordAtom,
  register,
  registerAction,
  usernameAtom,
} from '#/features/auth/';
import { cn } from '#/shared/lib/bem';

import { PasswordStrengthIndicator } from '../PasswordStrengthIndicator';
import { UsernameIndicator } from '../UsernameIndicator';

import './RegisterForm.scss';

const cnRegister = cn('RegisterForm');

export const RegisterForm: React.FC = () => {
  const [username] = useAtom(usernameAtom);
  const [password] = useAtom(passwordAtom);
  const [confirmPassword] = useAtom(confirmPasswordAtom);
  const [isPasswordMatch] = useAtom(isPasswordMatchAtom);
  const [isFormValid] = useAtom(isRegisterFormValidAtom);
  const [pending] = useAtom(register.pending);
  const isPending = pending > 0;

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleRegister = useAction(registerAction);
  const handleUsernameChange = useAction(usernameAtom.set);
  const handlePasswordChange = useAction(passwordAtom.set);
  const handleConfirmPasswordChange = useAction(confirmPasswordAtom.set);

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
        onChange={(e) => handleUsernameChange(e.target.value)}
        disabled={isPending}
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
        onChange={(e) => handlePasswordChange(e.target.value)}
        disabled={isPending}
        autoComplete="new-password"
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
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
        onChange={(e) => handleConfirmPasswordChange(e.target.value)}
        disabled={isPending}
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
              <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        disabled={!isFormValid || isPending}
        onClick={handleRegister}
        className={cnRegister('Submit')}
      >
        {isPending ? <CircularProgress size={22} color="inherit" /> : 'Sign up'}
      </Button>

      <Typography variant="body2" align="center" className={cnRegister('Footer')}>
        Already have an account?{' '}
        <Typography
          component="a"
          href="#"
          variant="body2"
          className={cnRegister('Link')}
          onClick={wrap(() => loginRoute.go())}
        >
          Sign in
        </Typography>
      </Typography>
    </Box>
  );
};
