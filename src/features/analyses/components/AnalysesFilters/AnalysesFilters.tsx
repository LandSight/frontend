import React from 'react';
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
import { useAction, useAtom } from '@reatom/react';

import { type AnalysisStatus, analysisStatus } from '#/features/analyses/types';
import { cn } from '#/shared/lib/bem';

import { filtersAtom } from '../../models/analyses';

import './AnalysesFilters.scss';

const cnAnalysesFilters = cn('AnalysesFilters');

export const AnalysesFilters: React.FC = () => {
  const [filters] = useAtom(filtersAtom);
  const handleUpdateSearchFilter = useAction(filtersAtom.setSearch);
  const handleUpdateStatusesFilter = useAction(filtersAtom.setStatuses);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleUpdateSearchFilter(event.target.value);
  };

  const handleStatusChange = (event: SelectChangeEvent<AnalysisStatus[]>) => {
    const value = event.target.value;
    const statuses = (typeof value === 'string' ? value.split(',') : value) as AnalysisStatus[];
    handleUpdateStatusesFilter(statuses);
  };

  const handleDeleteStatus = (statusToDelete: AnalysisStatus) => {
    const newStatuses = filters.statuses.filter((status) => status !== statusToDelete);
    handleUpdateStatusesFilter(newStatuses);
  };

  return (
    <Box className={cnAnalysesFilters()}>
      <Box className={cnAnalysesFilters('Row')}>
        <TextField
          label="Search by parcel name or analysis name"
          variant="outlined"
          className={cnAnalysesFilters('Search')}
          value={filters.search}
          onChange={handleSearchChange}
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
                    label={value}
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
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};
