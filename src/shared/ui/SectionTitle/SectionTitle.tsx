import { Divider } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import { cn } from '#/shared/lib/bem';

import './SectionTitle.scss';

const cnSectionTitle = cn('SectionTitle');

export interface SectionTitleProps {
  children: string;
}

export const SectionTitle = reatomComponent<SectionTitleProps>(
  ({ children }) => <Divider className={cnSectionTitle()}>{children}</Divider>,
  'SectionTitle'
);
