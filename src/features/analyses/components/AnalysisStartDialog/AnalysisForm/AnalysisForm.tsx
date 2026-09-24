import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  MenuItem,
  Paper,
  TextField,
} from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import { AnalysisNameIndicator } from '#/features/analyses/components/AnalysisNameIndicator';
import {
  analysisParcelIdAtom,
  isAnalysisNameValidAtom,
  newAnalysisNameAtom,
  runAnalysis,
  startAnalysis,
} from '#/features/analyses/models/analyses';
import { parcelsListAtom } from '#/features/parcels/models';
import { cn } from '#/shared/lib/bem';

import './AnalysisForm.scss';

const cnAnalysisForm = cn('AnalysisForm');

export const AnalysisForm = reatomComponent(() => {
  const parcels = parcelsListAtom();
  const parcelId = analysisParcelIdAtom();
  const analysisName = newAnalysisNameAtom();
  const isNameValid = isAnalysisNameValidAtom();
  const isLoading = startAnalysis.status().isPending;

  const hasParcels = parcels.length > 0;
  const hasSelected = parcelId != null;

  return (
    <Paper elevation={0} className={cnAnalysisForm('Container')}>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          select
          label="Parcel"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={parcelId ?? ''}
          onChange={(e) => wrap(analysisParcelIdAtom.set(e.target.value))}
          disabled={!hasParcels}
        >
          <MenuItem value="" disabled>
            Select a parcel
          </MenuItem>
          {parcels.map((parcel) => (
            <MenuItem key={parcel.id} value={parcel.id}>
              {parcel.name}
            </MenuItem>
          ))}
        </TextField>
        <FormControl component="fieldset" margin="normal" required fullWidth>
          <FormLabel component="legend">Analysis name</FormLabel>
          <TextField
            placeholder="Enter analysis name"
            variant="outlined"
            value={analysisName}
            onChange={(e) => wrap(newAnalysisNameAtom.set(e.target.value))}
            disabled={!hasSelected}
            fullWidth
          />
          <AnalysisNameIndicator />
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
