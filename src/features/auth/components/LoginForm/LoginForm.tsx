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
import { reatomComponent } from '@reatom/react';

import {
  goToRegisterPageAction,
  isLoginFormValidAtom,
  loginAction,
  passwordAtom,
  rememberMeAtom,
  usernameAtom,
} from '#/features/auth';
import { cn } from '#/shared/lib/bem';

import './LoginForm.scss';

const cnLogin = cn('LoginForm');

export const LoginForm = reatomComponent(() => {
  const username = usernameAtom();
  const password = passwordAtom();
  const rememberMe = rememberMeAtom();

  const isFormValid = isLoginFormValidAtom();
  const isLogginingIn = loginAction.status().isPending;

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
        onChange={(e) => wrap(usernameAtom.set(e.target.value))}
        disabled={isLogginingIn}
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
        onChange={(e) => wrap(passwordAtom.set(e.target.value))}
        disabled={isLogginingIn}
        autoComplete="current-password"
        required
      />

      <Box className={cnLogin('RememberRow')}>
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={wrap(rememberMeAtom.toggle)}
              disabled={isLogginingIn}
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
        disabled={!isFormValid || isLogginingIn}
        onClick={wrap(loginAction)}
        className={cnLogin('Submit')}
      >
        {isLogginingIn ? <CircularProgress size={22} color="inherit" /> : 'Sign in'}
      </Button>

      <Typography variant="body2" align="center" className={cnLogin('Footer')}>
        {"Don't have an account? "}
        <Typography
          component="a"
          href="#"
          variant="body2"
          className={cnLogin('Link')}
          onClick={wrap(goToRegisterPageAction)}
        >
          Sign up
        </Typography>
      </Typography>
    </Box>
  );
}, 'LoginForm');
