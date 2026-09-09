import { LinearProgress, Typography } from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomFactoryComponent } from '@reatom/react';

import {
  deleteParcel,
  fetchParcels,
  parcelsAtom,
  parcelsListAtom,
  pendingDeleteParcelIdAtom,
  selectedParcelIdAtom,
} from '#/features/parcels/models';
import { cn } from '#/shared/lib/bem';

import { ParcelDeleteDialog } from '../ParcelDeleteDialog';

import { ParcelList } from './ParcelList';

import './ParcelListContainer.scss';

const cnParcelListContainer = cn('ParcelListContainer');

export const ParcelListContainer = reatomFactoryComponent(() => {
  fetchParcels();
  return () => {
    const parcels = parcelsListAtom();
    const isLoading = fetchParcels.status().isPending;

    const pendingDeleteId = pendingDeleteParcelIdAtom();
    const isDeleting = deleteParcel.status().isPending;
    const pendingParcelName = pendingDeleteId ? parcelsAtom()[pendingDeleteId]?.name : undefined;

    const handleDeleteRequest = (id: string) => {
      wrap(pendingDeleteParcelIdAtom.set(id));
    };

    const handleConfirmDelete = async () => {
      if (!pendingDeleteId) return;
      await deleteParcel(pendingDeleteId);
      wrap(pendingDeleteParcelIdAtom.set(null));
    };

    const handleCancelDelete = () => {
      if (!isDeleting) {
        wrap(pendingDeleteParcelIdAtom.set(null));
      }
    };

    const handleParcelClick = (id: string) => {
      if (selectedParcelIdAtom() === id) {
        selectedParcelIdAtom.set(null);
      } else {
        selectedParcelIdAtom.set(id);
      }
    };

    // Если ещё не загружено и нет данных – показываем лоадер
    if (isLoading) {
      return <LinearProgress />;
    }

    return (
      <>
        {parcels.length === 0 ? (
          <Typography className={cnParcelListContainer()}>
            You don&apos;t have any parcels yet. Create a new one!
          </Typography>
        ) : (
          <ParcelList
            parcels={parcels}
            selectedParcelId={selectedParcelIdAtom()}
            onClick={handleParcelClick}
            onDelete={handleDeleteRequest}
          />
        )}

        <ParcelDeleteDialog
          open={!!pendingDeleteId}
          parcelName={pendingParcelName}
          isLoading={isDeleting}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      </>
    );
  };
}, 'ParcelListContainer');
