import { CenterFocusStrong as CenterFocusStrongIcon } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import { focusSelectedParcel } from '#/features/map/models';
import { selectedParcelAtom } from '#/features/parcels/models/parcels';
import { cn } from '#/shared/lib/bem';

import './FocusParcelControl.scss';

const cnFocusParcelControl = cn('FocusParcelControl');

export const FocusParcelControl = reatomComponent(() => {
  const parcel = selectedParcelAtom();

  return (
    <div className={cnFocusParcelControl()}>
      <Tooltip title="Focus selected parcel" placement="left">
        <span>
          <IconButton
            size="medium"
            disabled={!parcel}
            onClick={() => wrap(focusSelectedParcel())}
            className={cnFocusParcelControl('Button')}
          >
            <CenterFocusStrongIcon />
          </IconButton>
        </span>
      </Tooltip>
    </div>
  );
}, 'FocusParcelControl');
