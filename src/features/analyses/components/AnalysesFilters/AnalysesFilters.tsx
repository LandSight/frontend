import type { ChangeEvent } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import {
  type AnalysisStatus,
  analysisStatus,
  analysisStatusLabels,
} from '#/features/analyses/types';
import { cn } from '#/shared/lib/bem';

import { filtersAtom } from '../../models/analyses';

import './AnalysesFilters.scss';

const cnAnalysesFilters = cn('AnalysesFilters');

export const AnalysesFilters = reatomComponent(() => {
  const filters = filtersAtom();

  const handleStatusChange = (event: SelectChangeEvent<AnalysisStatus[]>) => {
    const value = event.target.value;
    const statuses = (typeof value === 'string' ? value.split(',') : value) as AnalysisStatus[];
    wrap(filtersAtom.setStatuses(statuses));
  };

  const handleDeleteStatus = (statusToDelete: AnalysisStatus) => {
    wrap(filtersAtom.setStatuses(filters.statuses.filter((status) => status !== statusToDelete)));
  };

  return (
    <Box className={cnAnalysesFilters()}>
      <Box className={cnAnalysesFilters('Row')}>
        <TextField
          label="Search by parcel name or analysis name"
          variant="outlined"
          className={cnAnalysesFilters('Search')}
          value={filters.search}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            wrap(filtersAtom.setSearch(event.target.value))
          }
          size="small"
        />
        <FormControl size="small" className={cnAnalysesFilters('SelectMultiple')}>
          <InputLabel>Status</InputLabel>
          <Select
            multiple
            value={filters.statuses}
            onChange={handleStatusChange}
            renderValue={(selected) => (
              <div className={cnAnalysesFilters('ChipContainer')}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={analysisStatusLabels[value]}
                    size="small"
                    onDelete={() => handleDeleteStatus(value)}
                    onMouseDown={(event) => event.stopPropagation()}
                    className={cnAnalysesFilters('Chip')}
                  />
                ))}
              </div>
            )}
            label="Status"
          >
            {analysisStatus.map((status) => (
              <MenuItem key={status} value={status} className={cnAnalysesFilters('MenuItem')}>
                <Checkbox checked={filters.statuses.includes(status)} />
                {analysisStatusLabels[status]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}, 'AnalysesFilters');
