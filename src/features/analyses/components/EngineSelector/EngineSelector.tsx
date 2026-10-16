import { MenuItem, TextField } from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import {
  enginesListAtom,
  selectedEngineAtom,
  selectedEngineKeyAtom,
} from '#/features/analyses/models/analyses';
import { cn } from '#/shared/lib/bem';

import './EngineSelector.scss';

const cnEngineSelector = cn('EngineSelector');

export const EngineSelector = reatomComponent(() => {
  const engines = enginesListAtom();
  const selectedKey = selectedEngineKeyAtom();
  const selectedEngine = selectedEngineAtom();

  return (
    <span className={cnEngineSelector('Wrapper')}>
      <TextField
        select
        label="Engine"
        variant="outlined"
        fullWidth
        margin="normal"
        value={selectedKey ?? ''}
        onChange={(event) => wrap(selectedEngineKeyAtom.set(event.target.value))}
        disabled={engines.length === 0}
        helperText={selectedEngine?.description}
      >
        {engines.map((engine) => (
          <MenuItem key={engine.key} value={engine.key}>
            {engine.name} {engine.version}
          </MenuItem>
        ))}
      </TextField>
    </span>
  );
}, 'EngineSelector');
