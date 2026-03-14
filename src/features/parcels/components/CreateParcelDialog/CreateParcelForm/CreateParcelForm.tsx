import React from 'react';
import { Box, Button, CircularProgress, Paper, TextField } from '@mui/material';

import { cn } from '#/shared/lib/bem';

import type { CreateParcelFormProps } from './types';

import './CreateParcelForm.scss';

const cnCreateParcelForm = cn('CreateParcelForm');

export const CreateParcelForm: React.FC<CreateParcelFormProps> = ({
  polygon,
  name,
  onNameChange,
  onSubmit,
  isLoading,
}) => {
  const handleCreateParcel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!polygon || polygon.length === 0) {
      return;
    }
    await onSubmit();
  };

  return (
    <Paper elevation={0} className={cnCreateParcelForm('Container')}>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleCreateParcel}
        className={cnCreateParcelForm('Form')}
      >
        <TextField
          label="Parcel name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          disabled={isLoading}
          required
          autoFocus
        />
        <Box className={cnCreateParcelForm('ButtonContainer')}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!polygon || !name.trim() || isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
            size="medium"
          >
            {isLoading ? 'Creating...' : 'Create parcel'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
