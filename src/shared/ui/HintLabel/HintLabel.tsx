import type { ReactNode } from 'react';
import { Tooltip } from '@mui/material';
import { reatomComponent } from '@reatom/react';

import { cn } from '#/shared/lib/bem';

import './HintLabel.scss';

const cnHintLabel = cn('HintLabel');

export interface HintLabelProps {
  hint: string;
  children: ReactNode;
}

/** A label with a dotted underline that explains itself in a tooltip on hover. */
export const HintLabel = reatomComponent<HintLabelProps>(
  ({ hint, children }) => (
    <Tooltip title={hint} placement="top" arrow>
      <span className={cnHintLabel()}>{children}</span>
    </Tooltip>
  ),
  'HintLabel'
);
