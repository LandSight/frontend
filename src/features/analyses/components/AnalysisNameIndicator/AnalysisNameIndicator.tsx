import { Cancel, CheckCircle } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import {
  isAnalysisNameMaxLengthAtom,
  isAnalysisNameMinLengthAtom,
  isAnalysisNameValidCharsAtom,
} from '#/features/analyses/models/analyses';
import { cn } from '#/shared/lib/bem';

import './AnalysisNameIndicator.scss';

const cnAnalysisNameIndicator = cn('AnalysisNameIndicator');

export const AnalysisNameIndicator = reatomComponent(() => {
  const minLength = isAnalysisNameMinLengthAtom();
  const maxLength = isAnalysisNameMaxLengthAtom();
  const validChars = isAnalysisNameValidCharsAtom();

  const requirements = [
    { label: '3–64 characters', isValid: minLength && maxLength },
    { label: 'Letters, numbers, spaces, _, -', isValid: validChars },
  ];

  return (
    <Box className={cnAnalysisNameIndicator()}>
      {requirements.map((requirement) => (
        <Box key={requirement.label} className={cnAnalysisNameIndicator('Item')}>
          {requirement.isValid ? (
            <CheckCircle
              className={cnAnalysisNameIndicator('Icon')}
              sx={{ color: 'success.main' }}
            />
          ) : (
            <Cancel className={cnAnalysisNameIndicator('Icon')} sx={{ color: 'text.disabled' }} />
          )}
          <Typography
            variant="body2"
            className={cnAnalysisNameIndicator('Text')}
            sx={{ color: requirement.isValid ? 'success.main' : 'text.secondary' }}
          >
            {requirement.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}, 'AnalysisNameIndicator');
