import React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';

import type { AnalysisType } from '#/features/analysis/types';
import { cn } from '#/shared/lib/bem';

import type { AnalysisFormProps } from './types';

import './AnalysisForm.scss';

const cnAnalysisForm = cn('AnalysisForm');

export const AnalysisForm: React.FC<AnalysisFormProps> = ({
  selectedParcel,
  analysisType,
  onAnalysisTypeChange,
  onRunAnalysis,
  isLoading,
}) => {
  const analysisTypesMap: Record<AnalysisType, string> = {
    infrastructure: 'Infrastructure',
    ihb: 'IHB',
    agricultural: 'Agricultural',
  };

  const handleRunAnalysis = async () => {
    if (!selectedParcel) return;
    try {
      await onRunAnalysis({
        type: analysisType,
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
        <FormControl component="fieldset" margin="normal" required>
          <FormLabel component="legend">Analysis type</FormLabel>
          <RadioGroup
            value={analysisType}
            onChange={(e) => onAnalysisTypeChange(e.target.value as AnalysisType)}
          >
            {Object.entries(analysisTypesMap).map(([value, label]) => (
              <FormControlLabel
                key={value}
                value={value}
                control={<Radio />}
                label={label}
                disabled={!hasSelected}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <Box className={cnAnalysisForm('ButtonContainer')}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRunAnalysis}
            disabled={!hasSelected || !analysisType || isLoading}
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
