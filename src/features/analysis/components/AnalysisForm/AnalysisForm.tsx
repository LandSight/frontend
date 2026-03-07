import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';

import { cn } from '#/shared/lib/bem';
import type { AnalysisType } from '#/shared/types/analysis';

import { useAppDispatch, useAppSelector } from '../../../../app/store/hooks';
import { clearPolygon, setAnalysisType, setName } from '../../../../app/store/slices/polygon';
import { useCreateAnalysis } from '../../hooks/useCreateAnalysis';

import './AnalysisForm.scss';

const cnAnalysisForm = cn('AnalysisForm');

const ANALYSIS_TYPES = [
  { value: 'infrastructure', label: 'Инфраструктура' },
  { value: 'izhs', label: 'ИЖС' },
  { value: 'agricultural', label: 'Сельхозназначение' },
] as const;

const AnalysisForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const createAnalysis = useCreateAnalysis();
  const { name, analysisType, coordinates } = useAppSelector((state) => state.polygon);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleRunAnalysis = () => {
    if (!coordinates || !name || !analysisType) {
      setSnackbar({
        open: true,
        message: 'Заполните все поля и нарисуйте полигон',
        severity: 'error',
      });
      return;
    }

    createAnalysis.mutate(
      { name, type: analysisType, polygon: coordinates },
      {
        onSuccess: () => {
          dispatch(clearPolygon());
          setSnackbar({ open: true, message: 'Успешно!', severity: 'success' });
        },
        onError: () => {
          setSnackbar({ open: true, message: 'Ошибка!', severity: 'error' });
        },
      }
    );
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Paper elevation={0} className={cnAnalysisForm('Container')}>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            label="Название участка"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={name}
            onChange={(e) => dispatch(setName(e.target.value))}
          />
          <FormControl component="fieldset" margin="normal" required>
            <FormLabel component="legend">Тип анализа</FormLabel>
            <RadioGroup
              value={analysisType}
              onChange={(e) => dispatch(setAnalysisType(e.target.value as AnalysisType))}
            >
              {ANALYSIS_TYPES.map(({ value, label }) => (
                <FormControlLabel key={value} value={value} control={<Radio />} label={label} />
              ))}
            </RadioGroup>
          </FormControl>
          {coordinates ? (
            <Typography variant="body2" color="success.main" className={cnAnalysisForm('Message')}>
              Полигон нарисован. Можно запустить анализ.
            </Typography>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              className={cnAnalysisForm('Message')}
            >
              Используйте инструменты рисования на карте, чтобы нарисовать полигон.
            </Typography>
          )}
          <Box className={cnAnalysisForm('ButtonContainer')}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRunAnalysis}
              disabled={!coordinates || !name || !analysisType || createAnalysis.isPending}
              startIcon={createAnalysis.isPending ? <CircularProgress size={20} /> : null}
              size="large"
            >
              {createAnalysis.isPending ? 'Запуск...' : 'Запустить анализ'}
            </Button>
          </Box>
        </Box>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AnalysisForm;
