import { Box, CircularProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { reatomFactoryComponent } from '@reatom/react';

import { isSessionCheckingAtom, restoreSession } from '#/features/auth';

import { AuthLayout } from './layouts/AuthLayout';
import { rootLayout } from './routes';
import { theme } from './theme';

export const App = reatomFactoryComponent(() => {
  restoreSession();
  return () => {
    const isChecking = isSessionCheckingAtom();

    if (isChecking) {
      return (
        <ThemeProvider theme={theme}>
          <Box sx={{ position: 'relative' }}>
            <AuthLayout>
              <Box sx={{ height: 320, width: 420 }} />
            </AuthLayout>
            <Box
              sx={{
                position: 'fixed',
                inset: 0,
                bgcolor: 'rgba(0, 0, 0, 0.55)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1300,
              }}
            >
              <CircularProgress size={84} thickness={4.5} />
            </Box>
          </Box>
        </ThemeProvider>
      );
    }

    return <ThemeProvider theme={theme}>{rootLayout.render()}</ThemeProvider>;
  };
}, 'App');
