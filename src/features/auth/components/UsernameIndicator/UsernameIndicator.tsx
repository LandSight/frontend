import { Cancel, CheckCircle } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import {
  isUsernameMaxLengthAtom,
  isUsernameMinLengthAtom,
  isUsernameValidCharsAtom,
} from '#/features/auth';
import { cn } from '#/shared/lib/bem';

import './UsernameIndicator.scss';

const cnUsername = cn('UsernameIndicator');

export const UsernameIndicator = reatomComponent(() => {
  const minLength = isUsernameMinLengthAtom();
  const maxLength = isUsernameMaxLengthAtom();
  const validChars = isUsernameValidCharsAtom();

  const requirements = [
    {
      label: '3-50 characters',
      isValid: minLength && maxLength,
    },
    {
      label: 'Letters, numbers, _, -',
      isValid: validChars,
    },
  ];

  return (
    <Box className={cnUsername()}>
      {requirements.map((req) => (
        <Box key={req.label} className={cnUsername('Item')}>
          {req.isValid ? (
            <CheckCircle className={cnUsername('Icon')} sx={{ color: 'success.main' }} />
          ) : (
            <Cancel className={cnUsername('Icon')} sx={{ color: 'text.disabled' }} />
          )}
          <Typography
            variant="body2"
            className={cnUsername('Text')}
            sx={{
              color: req.isValid ? 'success.main' : 'text.secondary',
            }}
          >
            {req.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}, 'UsernameIndicator');
