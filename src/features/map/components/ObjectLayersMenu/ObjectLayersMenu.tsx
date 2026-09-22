import { useState } from 'react';
import MapIcon from '@mui/icons-material/Map';
import { Checkbox, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import {
  analysisMetricRefsAtom,
  infrastructureCategoriesAtom,
  toggleObjectCategory,
  visibleObjectCategoriesAtom,
} from '#/features/infrastructure/models';
import { selectedAnalysisIdAtom } from '#/features/workspace/models';
import { cn } from '#/shared/lib/bem';

import './ObjectLayersMenu.scss';

const cnObjectLayersMenu = cn('ObjectLayersMenu');

export const ObjectLayersMenu = reatomComponent(() => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const analysisId = selectedAnalysisIdAtom();
  const refs = analysisId ? (analysisMetricRefsAtom()[analysisId] ?? []) : [];
  const labels = infrastructureCategoriesAtom();
  const visible = analysisId ? (visibleObjectCategoriesAtom()[analysisId] ?? []) : [];

  const options = refs
    .filter((ref) => ref.category != null && labels[ref.category] != null)
    .map((ref) => ({
      category: ref.category as string,
      label: labels[ref.category as string],
      metricsId: ref.metrics_id,
    }));

  const disabled = analysisId == null || options.length === 0;

  return (
    <div className={cnObjectLayersMenu()}>
      <Tooltip title="Objects on map" placement="left">
        <span>
          <IconButton
            size="medium"
            disabled={disabled}
            onClick={(event) => setAnchorEl(event.currentTarget)}
            className={cnObjectLayersMenu('Button')}
          >
            <MapIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
        transformOrigin={{ vertical: 'center', horizontal: 'right' }}
      >
        {analysisId != null && options.length > 0 ? (
          options.map((option) => (
            <MenuItem
              key={option.category}
              dense
              onClick={() =>
                wrap(toggleObjectCategory(analysisId, option.category, option.metricsId))
              }
            >
              <Checkbox size="small" checked={visible.includes(option.category)} />
              <Typography variant="body2">{option.label}</Typography>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>Select an analysis to show objects</MenuItem>
        )}
      </Menu>
    </div>
  );
}, 'ObjectLayersMenu');
