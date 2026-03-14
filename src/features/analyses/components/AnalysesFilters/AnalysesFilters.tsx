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
import { useAtom } from '@reatom/react';

import {
  type AnalysisStatus,
  analysisStatus,
  type AnalysisType,
  analysisType,
  type SortBy,
  sortByFields,
  type SortOrder,
  sortOrderValues,
} from '#/features/analyses/types';
import { cn } from '#/shared/lib/bem';

import { filtersAtom, setFilters } from '../../models/analyses';

import './AnalysesFilters.scss';

const cnAnalysesFilters = cn('AnalysesFilters');

export const AnalysesFilters: React.FC = () => {
  const [filters] = useAtom(filtersAtom);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: event.target.value });
  };

  const handleTypeChange = (event: SelectChangeEvent<AnalysisType[]>) => {
    const value = event.target.value;
    const types = (typeof value === 'string' ? value.split(',') : value) as AnalysisType[];
    setFilters({ types });
  };

  const handleDeleteType = (typeToDelete: AnalysisType) => {
    const newTypes = filters.types.filter((type) => type !== typeToDelete);
    setFilters({ types: newTypes });
  };

  const handleStatusChange = (event: SelectChangeEvent<AnalysisStatus[]>) => {
    const value = event.target.value;
    const statuses = (typeof value === 'string' ? value.split(',') : value) as AnalysisStatus[];
    setFilters({ statuses });
  };

  const handleDeleteStatus = (statusToDelete: AnalysisStatus) => {
    const newStatuses = filters.statuses.filter((status) => status !== statusToDelete);
    setFilters({ statuses: newStatuses });
  };

  const handleSortByChange = (event: SelectChangeEvent) => {
    setFilters({ sortBy: event.target.value as SortBy });
  };

  const handleSortOrderChange = (event: SelectChangeEvent) => {
    setFilters({ sortOrder: event.target.value as SortOrder });
  };

  return (
    <Box className={cnAnalysesFilters()}>
      <Box className={cnAnalysesFilters('Row')}>
        <TextField
          label="Search by parcel name"
          variant="outlined"
          className={cnAnalysesFilters('Search')}
          value={filters.search}
          onChange={handleSearchChange}
          size="small"
        />
        <FormControl size="small" className={cnAnalysesFilters('SelectMultiple')}>
          <InputLabel>Type</InputLabel>
          <Select
            multiple
            value={filters.types}
            onChange={handleTypeChange}
            renderValue={(selected) => (
              <div className={cnAnalysesFilters('ChipContainer')}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    size="small"
                    onDelete={() => handleDeleteType(value)}
                    onMouseDown={(event) => event.stopPropagation()}
                    className={cnAnalysesFilters('Chip')}
                  />
                ))}
              </div>
            )}
            label="Type"
          >
            {analysisType.map((type) => (
              <MenuItem key={type} value={type} className={cnAnalysesFilters('MenuItem')}>
                <Checkbox checked={filters.types.includes(type)} />
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
        <FormControl size="small" className={cnAnalysesFilters('Select')}>
          <InputLabel>Sort by</InputLabel>
          <Select value={filters.sortBy} onChange={handleSortByChange} label="Sort by">
            {sortByFields.map((field) => (
              <MenuItem key={field} value={field}>
                {field === 'created_at' ? 'Created at' : 'Score'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" className={cnAnalysesFilters('Select')}>
          <InputLabel>Order</InputLabel>
          <Select value={filters.sortOrder} onChange={handleSortOrderChange} label="Order">
            {sortOrderValues.map((order) => (
              <MenuItem key={order} value={order}>
                {order === 'asc' ? 'Ascending' : 'Descending'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};
