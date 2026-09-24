import type { ChangeEvent } from 'react';
import {
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
} from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import {
  type AnalysisStatus,
  analysisStatus,
  analysisStatusLabels,
  type SortBy,
  sortByFields,
} from '#/features/analyses/types';
import { parcelsListAtom } from '#/features/parcels/models';
import { cn } from '#/shared/lib/bem';

import { filtersAtom } from '../../models/analyses';

import './AnalysesFilters.scss';

const cnAnalysesFilters = cn('AnalysesFilters');

const sortByLabels: Record<SortBy, string> = {
  parcel_name: 'Parcel',
  name: 'Name',
  status: 'Status',
  created_at: 'Created',
  score: 'Score',
};

export const AnalysesFilters = reatomComponent(() => {
  const filters = filtersAtom();
  const parcels = parcelsListAtom();

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    wrap(filtersAtom.setSearch(event.target.value));
  };

  const handleParcelChange = (event: SelectChangeEvent<string>) => {
    wrap(filtersAtom.setParcelId(event.target.value || null));
  };

  const handleStatusChange = (event: SelectChangeEvent<AnalysisStatus[]>) => {
    const value = event.target.value;
    const statuses = (typeof value === 'string' ? value.split(',') : value) as AnalysisStatus[];
    wrap(filtersAtom.setStatuses(statuses));
  };

  const handleDeleteStatus = (statusToDelete: AnalysisStatus) => {
    wrap(filtersAtom.setStatuses(filters.statuses.filter((status) => status !== statusToDelete)));
  };

  const handleSortByChange = (event: SelectChangeEvent<SortBy>) => {
    wrap(filtersAtom.setSortBy(event.target.value as SortBy));
  };

  const toggleSortOrder = () => {
    wrap(filtersAtom.setSortOrder(filters.sortOrder === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <Box className={cnAnalysesFilters()}>
      <TextField
        label="Search"
        placeholder="Analysis or parcel name"
        variant="outlined"
        size="small"
        fullWidth
        value={filters.search}
        onChange={handleSearchChange}
        className={cnAnalysesFilters('Search')}
      />

      <Box className={cnAnalysesFilters('Controls')}>
        <FormControl size="small" className={cnAnalysesFilters('Control')}>
          <InputLabel>Parcel</InputLabel>
          <Select value={filters.parcelId ?? ''} label="Parcel" onChange={handleParcelChange}>
            <MenuItem value="">All parcels</MenuItem>
            {parcels.map((parcel) => (
              <MenuItem key={parcel.id} value={parcel.id}>
                {parcel.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" className={cnAnalysesFilters('Control')}>
          <InputLabel>Status</InputLabel>
          <Select
            multiple
            value={filters.statuses}
            onChange={handleStatusChange}
            label="Status"
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

      <Box className={cnAnalysesFilters('Controls')}>
        <FormControl size="small" className={cnAnalysesFilters('Control')}>
          <InputLabel>Sort by</InputLabel>
          <Select value={filters.sortBy} label="Sort by" onChange={handleSortByChange}>
            {sortByFields.map((field) => (
              <MenuItem key={field} value={field}>
                {sortByLabels[field]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Tooltip title={filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}>
          <IconButton
            size="small"
            onClick={toggleSortOrder}
            className={cnAnalysesFilters('SortOrder')}
          >
            {filters.sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}, 'AnalysesFilters');
