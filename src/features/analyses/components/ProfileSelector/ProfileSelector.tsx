import { MenuItem, TextField, Tooltip } from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import { profilesListAtom, selectedProfileKeyAtom } from '#/features/analyses/models/analyses';
import { cn } from '#/shared/lib/bem';

import './ProfileSelector.scss';

const cnProfileSelector = cn('ProfileSelector');

const COMING_SOON_TOOLTIP =
  'New profiles will soon be available: Agriculture and Commercial Development.';

export const ProfileSelector = reatomComponent(() => {
  const profiles = profilesListAtom();
  const selectedKey = selectedProfileKeyAtom();
  const isDisabled = profiles.length <= 1;
  const selectedProfile = profiles.find((profile) => profile.key === selectedKey);

  return (
    <Tooltip title={COMING_SOON_TOOLTIP} placement="top" arrow>
      <span className={cnProfileSelector('Wrapper')}>
        <TextField
          select
          label="Analysis profile"
          variant="outlined"
          fullWidth
          margin="normal"
          value={selectedKey ?? ''}
          onChange={(event) => wrap(selectedProfileKeyAtom.set(event.target.value))}
          disabled={isDisabled}
          helperText={selectedProfile?.description}
        >
          {profiles.map((profile) => (
            <MenuItem key={profile.key} value={profile.key}>
              {profile.name}
            </MenuItem>
          ))}
        </TextField>
      </span>
    </Tooltip>
  );
}, 'ProfileSelector');
