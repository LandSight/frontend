import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Paper,
  TextField,
} from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import {
  analysisNameErrorAtom,
  isAnalysisNameValidAtom,
  newAnalysisNameAtom,
  runAnalysis,
  startAnalysis,
} from '#/features/analyses/models/analyses';
import { selectedParcelAtom } from '#/features/parcels/models';
import { cn } from '#/shared/lib/bem';

import './AnalysisForm.scss';

const cnAnalysisForm = cn('AnalysisForm');

export const AnalysisForm = reatomComponent(() => {
  const selectedParcel = selectedParcelAtom();
  const analysisName = newAnalysisNameAtom();
  const nameError = analysisNameErrorAtom();
  const isNameValid = isAnalysisNameValidAtom();
  const isLoading = startAnalysis.status().isPending;

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
            onChange={(e) => wrap(newAnalysisNameAtom.set(e.target.value))}
            disabled={!hasSelected}
            error={Boolean(nameError)}
            helperText={nameError}
            fullWidth
          />
        </FormControl>
        <Box className={cnAnalysisForm('ButtonContainer')}>
          <Button
            variant="contained"
            color="primary"
            onClick={wrap(runAnalysis)}
            disabled={!hasSelected || !isNameValid || isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
            size="large"
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Start analysis'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}, 'AnalysisForm');
