import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import { wrap } from '@reatom/core';
import { useAction, useAtom } from '@reatom/react';

import { registerRoute } from '#/app/routes/routes';
import {
  isLoginFormValidAtom,
  login,
  loginAction,
  passwordAtom,
  rememberMeAtom,
  usernameAtom,
} from '#/features/auth';
import { cn } from '#/shared/lib/bem';

import './LoginForm.scss';

const cnLogin = cn('LoginForm');

export const LoginForm: React.FC = () => {
  const [username] = useAtom(usernameAtom);
  const [password] = useAtom(passwordAtom);
  const [rememberMe] = useAtom(rememberMeAtom);
  const [isFormValid] = useAtom(isLoginFormValidAtom);
  const [pending] = useAtom(login.pending);
  const isPending = pending > 0;

  const handleLogin = useAction(loginAction);
  const handleUsernameChange = useAction(usernameAtom.set);
  const handlePasswordChange = useAction(passwordAtom.set);
  const handleRememberMeToggle = useAction(rememberMeAtom.toggle);

  return (
    <Box component="form" className={cnLogin()}>
      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        align="center"
        className={cnLogin('Title')}
      >
        Welcome back
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        gutterBottom
        align="center"
        className={cnLogin('Subtitle')}
      >
        Sign in to continue to LandSight
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

      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => handlePasswordChange(e.target.value)}
        disabled={isPending}
        autoComplete="current-password"
        required
      />

      <Box className={cnLogin('RememberRow')}>
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={handleRememberMeToggle}
              disabled={isPending}
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
        disabled={!isFormValid || isPending}
        onClick={handleLogin}
        className={cnLogin('Submit')}
      >
        {isPending ? <CircularProgress size={22} color="inherit" /> : 'Sign in'}
      </Button>

      <Typography variant="body2" align="center" className={cnLogin('Footer')}>
        {"Don't have an account?"}
        <Typography
          component="a"
          href="#"
          variant="body2"
          className={cnLogin('Link')}
          onClick={wrap(() => registerRoute.go())}
        >
          Sign up
        </Typography>
      </Typography>
    </Box>
  );
};
