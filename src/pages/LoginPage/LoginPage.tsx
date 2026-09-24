import { Box, Card, CardContent } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import { LoginForm } from '#/features/auth/components/LoginForm';
import { cn } from '#/shared/lib/bem';

import './LoginPage.scss';

const cnLogin = cn('LoginPage');

export const LoginPage = reatomComponent(
  () => (
    <Box className={cnLogin()}>
      <Card className={cnLogin('Card')} variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent className={cnLogin('Content')}>
          <LoginForm />
        </CardContent>
      </Card>
    </Box>
  ),
  'LoginPage'
);
