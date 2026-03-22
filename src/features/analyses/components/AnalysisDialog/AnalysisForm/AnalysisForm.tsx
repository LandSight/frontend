import React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Paper,
  TextField,
} from '@mui/material';

import { cn } from '#/shared/lib/bem';

import type { AnalysisFormProps } from './types';

import './AnalysisForm.scss';

const cnAnalysisForm = cn('AnalysisForm');

export const AnalysisForm: React.FC<AnalysisFormProps> = ({
  selectedParcel,
  analysisName,
  onAnalysisNameChange,
  onRunAnalysis,
  isLoading,
}) => {
  const handleRunAnalysis = async () => {
    if (!selectedParcel) return;
    try {
      await onRunAnalysis({
        name: analysisName,
        parcel_id: selectedParcel.id,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const hasSelected = !!selectedParcel;

  return (
    <Paper elevation={0} className={cnAnalysisForm('Container')}>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="Parcel name"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={selectedParcel?.name || ''}
          disabled
        />
        <FormControl component="fieldset" margin="normal" required fullWidth>
          <FormLabel component="legend">Analysis name</FormLabel>
          <TextField
            placeholder="Enter analysis name"
            variant="outlined"
            value={analysisName}
            onChange={(e) => onAnalysisNameChange(e.target.value)}
            disabled={!hasSelected}
            fullWidth
          />
        </FormControl>
        <Box className={cnAnalysisForm('ButtonContainer')}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRunAnalysis}
            disabled={!hasSelected || !analysisName || isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
            size="large"
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Start analysis'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
