import React from 'react';
import { Typography } from '@mui/material';

import { cn } from '../../../shared/lib/bem';

import './Footer.scss';

const cnFooter = cn('Footer');

export const Footer: React.FC = () => {
  return (
    <footer className={cnFooter()}>
      <Typography variant="caption" className={cnFooter('Text')}>
        © {new Date().getFullYear()} LandSight - Анализ земельных участков
      </Typography>
    </footer>
  );
};
