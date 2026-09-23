import { Cancel, CheckCircle } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import {
  isParcelNameMaxLengthAtom,
  isParcelNameMinLengthAtom,
  isParcelNameValidCharsAtom,
} from '#/features/parcels/models';
import { cn } from '#/shared/lib/bem';

import './ParcelNameIndicator.scss';

const cnParcelNameIndicator = cn('ParcelNameIndicator');

export const ParcelNameIndicator = reatomComponent(() => {
  const minLength = isParcelNameMinLengthAtom();
  const maxLength = isParcelNameMaxLengthAtom();
  const validChars = isParcelNameValidCharsAtom();

  const requirements = [
    { label: '3–64 characters', isValid: minLength && maxLength },
    { label: 'Letters, numbers, spaces, _, -', isValid: validChars },
  ];

  return (
    <Box className={cnParcelNameIndicator()}>
      {requirements.map((requirement) => (
        <Box key={requirement.label} className={cnParcelNameIndicator('Item')}>
          {requirement.isValid ? (
            <CheckCircle className={cnParcelNameIndicator('Icon')} sx={{ color: 'success.main' }} />
          ) : (
            <Cancel className={cnParcelNameIndicator('Icon')} sx={{ color: 'text.disabled' }} />
          )}
          <Typography
            variant="body2"
            className={cnParcelNameIndicator('Text')}
            sx={{ color: requirement.isValid ? 'success.main' : 'text.secondary' }}
          >
            {requirement.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}, 'ParcelNameIndicator');
