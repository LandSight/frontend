import { Box, Button, CircularProgress, Paper, TextField } from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import { clearDrawingState, drawingPolygonAtom } from '#/features/map/models';
import {
  createParcel,
  isCreateParcelDialogOpenAtom,
  isParcelNameValidAtom,
  newParcelNameAtom,
  parcelNameErrorAtom,
} from '#/features/parcels/models';
import { cn } from '#/shared/lib/bem';

import './CreateParcelForm.scss';

const cnCreateParcelForm = cn('CreateParcelForm');

export const CreateParcelForm = reatomComponent(() => {
  const polygon = drawingPolygonAtom();
  const name = newParcelNameAtom();
  const nameError = parcelNameErrorAtom();
  const isNameValid = isParcelNameValidAtom();
  const isLoading = createParcel.status().isPending;

  const handleSubmit = async () => {
    if (!polygon || !isNameValid) {
      return;
    }
    await createParcel({ name: name.trim(), polygon });
    wrap(isCreateParcelDialogOpenAtom.close());
    wrap(clearDrawingState());
  };

  return (
    <Paper elevation={0} className={cnCreateParcelForm('Container')}>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        className={cnCreateParcelForm('Form')}
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
      >
        <TextField
          label="Parcel name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(event) => wrap(newParcelNameAtom.set(event.target.value))}
          disabled={isLoading}
          error={Boolean(nameError)}
          helperText={nameError || '3–64 characters, must start with a letter'}
          required
          autoFocus
        />
        <Box className={cnCreateParcelForm('ButtonContainer')}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!polygon || !isNameValid || isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
            size="medium"
          >
            {isLoading ? 'Creating...' : 'Create parcel'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}, 'CreateParcelForm');
