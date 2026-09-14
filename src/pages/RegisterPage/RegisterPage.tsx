import React from 'react';
import { Box, Card, CardContent } from '@mui/material';

import { RegisterForm } from '#/features/auth/components/RegisterForm';
import { cn } from '#/shared/lib/bem';

import './RegisterPage.scss';

const cnRegister = cn('RegisterPage');

export const RegisterPage: React.FC = () => {
  return (
    <Box className={cnRegister()}>
      <Card className={cnRegister('Card')} variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent className={cnRegister('Content')}>
          <RegisterForm />
        </CardContent>
      </Card>
    </Box>
  );
};
