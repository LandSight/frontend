import {
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import {
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import { AnalysisRow } from '#/features/analyses/components/AnalysisRow';
import { openAnalysisDialog, requestDeleteAnalysis } from '#/features/analyses/models';
import { ParcelDeleteDialog } from '#/features/parcels/components/ParcelDeleteDialog';
import {
  deleteParcel,
  fetchParcels,
  parcelsAtom,
  parcelsListAtom,
  pendingDeleteParcelIdAtom,
  selectedParcelIdAtom,
} from '#/features/parcels/models';
import { cn } from '#/shared/lib/bem';

import {
  analysesByParcelAtom,
  expandedParcelIdsAtom,
  selectAnalysis,
  selectedAnalysisIdAtom,
  selectParcel,
  toggleParcelExpanded,
} from '../../models';

import './ParcelsPanel.scss';

const cnParcelsPanel = cn('ParcelsPanel');

export const ParcelsPanel = reatomComponent(() => {
  const parcels = parcelsListAtom();
  const selectedParcelId = selectedParcelIdAtom();
  const expandedIds = expandedParcelIdsAtom();
  const analysesByParcel = analysesByParcelAtom();
  const selectedAnalysisId = selectedAnalysisIdAtom();
  const isLoading = fetchParcels.status().isPending;

  const pendingDeleteId = pendingDeleteParcelIdAtom();
  const isDeletingParcel = deleteParcel.status().isPending;
  const pendingParcelName = pendingDeleteId ? parcelsAtom()[pendingDeleteId]?.name : undefined;

  if (isLoading && parcels.length === 0) {
    return <LinearProgress />;
  }

  if (parcels.length === 0) {
    return (
      <Typography variant="body2" className={cnParcelsPanel('Empty')}>
        You don&apos;t have any parcels yet. Create a new one on the map!
      </Typography>
    );
  }

  return (
    <>
      <List dense disablePadding className={cnParcelsPanel()}>
        {parcels.map((parcel) => {
          const isSelected = selectedParcelId === parcel.id;
          const isExpanded = expandedIds.includes(parcel.id);
          const parcelAnalyses = analysesByParcel[parcel.id] ?? [];

          return (
            <ListItem key={parcel.id} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                selected={isSelected}
                className={cnParcelsPanel('Item', { selected: isSelected })}
                onClick={() => wrap(selectParcel(isSelected ? null : parcel.id))}
              >
                <IconButton
                  size="small"
                  color="inherit"
                  className={cnParcelsPanel('ExpandButton', { expanded: isExpanded })}
                  onClick={(event) => {
                    event.stopPropagation();
                    wrap(toggleParcelExpanded(parcel.id));
                  }}
                >
                  <ExpandMoreIcon fontSize="small" />
                </IconButton>
                <ListItemText primary={parcel.name} slotProps={{ primary: { noWrap: true } }} />
                {isSelected && (
                  <Tooltip title="Start analysis">
                    <IconButton
                      size="small"
                      className={cnParcelsPanel('StartButton')}
                      onClick={(event) => {
                        event.stopPropagation();
                        wrap(openAnalysisDialog(parcel.id));
                      }}
                    >
                      <PlayArrowIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Delete parcel">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(event) => {
                      event.stopPropagation();
                      wrap(pendingDeleteParcelIdAtom.set(parcel.id));
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </ListItemButton>

              {isExpanded && (
                <List dense disablePadding className={cnParcelsPanel('SubList')}>
                  {parcelAnalyses.map((analysis) => (
                    <AnalysisRow
                      key={analysis.id}
                      analysis={analysis}
                      selected={selectedAnalysisId === analysis.id}
                      canDelete={analysis.status === 'completed' || analysis.status === 'failed'}
                      onSelect={wrap(selectAnalysis)}
                      onDelete={wrap(requestDeleteAnalysis)}
                    />
                  ))}
                  {parcelAnalyses.length === 0 && (
                    <Typography variant="body2" className={cnParcelsPanel('Empty')}>
                      No analyses yet
                    </Typography>
                  )}
                </List>
              )}
            </ListItem>
          );
        })}
      </List>

      <ParcelDeleteDialog
        open={!!pendingDeleteId}
        parcelName={pendingParcelName}
        isLoading={isDeletingParcel}
        onCancel={() => {
          if (!isDeletingParcel) {
            wrap(pendingDeleteParcelIdAtom.set(null));
          }
        }}
        onConfirm={() => {
          if (!pendingDeleteId) return;
          deleteParcel(pendingDeleteId).then(() => pendingDeleteParcelIdAtom.set(null));
        }}
      />
    </>
  );
}, 'ParcelsPanel');
