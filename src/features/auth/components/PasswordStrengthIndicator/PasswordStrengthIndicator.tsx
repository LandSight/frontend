import React from 'react';
import { Cancel, CheckCircle } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useAtom } from '@reatom/react';

import {
  isPasswordHasLowerCaseAtom,
  isPasswordHasNumberAtom,
  isPasswordHasSpecialCharAtom,
  isPasswordHasUpperCaseAtom,
  isPasswordMinLengthAtom,
} from '#/features/auth';
import { cn } from '#/shared/lib/bem';

import './PasswordStrengthIndicator.scss';

const cnPasswordStrength = cn('PasswordStrengthIndicator');

export const PasswordStrengthIndicator: React.FC = () => {
  const [isMinLength] = useAtom(isPasswordMinLengthAtom);
  const [hasUpper] = useAtom(isPasswordHasUpperCaseAtom);
  const [hasLower] = useAtom(isPasswordHasLowerCaseAtom);
  const [hasNumber] = useAtom(isPasswordHasNumberAtom);
  const [hasSpecial] = useAtom(isPasswordHasSpecialCharAtom);

  const requirements = [
    { label: 'At least 8 characters', isValid: isMinLength },
    { label: 'Uppercase letter', isValid: hasUpper },
    { label: 'Lowercase letter', isValid: hasLower },
    { label: 'Number', isValid: hasNumber },
    { label: 'Special character (!@#$%^&*)', isValid: hasSpecial },
  ];

  return (
    <Box className={cnPasswordStrength()}>
      {requirements.map((req) => (
        <Box key={req.label} className={cnPasswordStrength('Item')}>
          {req.isValid ? (
            <CheckCircle className={cnPasswordStrength('Icon')} sx={{ color: 'success.main' }} />
          ) : (
            <Cancel className={cnPasswordStrength('Icon')} sx={{ color: 'text.disabled' }} />
          )}
          <Typography
            variant="body2"
            className={cnPasswordStrength('Text')}
            sx={{ color: req.isValid ? 'success.main' : 'text.secondary' }}
          >
            {req.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
