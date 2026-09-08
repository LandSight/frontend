import { LinearProgress, Typography } from '@mui/material';
import { reatomFactoryComponent } from '@reatom/react';

import {
  deleteParcel,
  fetchParcels,
  parcelsListAtom,
  selectedParcelIdAtom,
} from '#/features/parcels/models';
import { cn } from '#/shared/lib/bem';

import { ParcelList } from './ParcelList';

import './ParcelListContainer.scss';

const cnParcelListContainer = cn('ParcelListContainer');

export const ParcelListContainer = reatomFactoryComponent(() => {
  fetchParcels();

  return () => {
    const parcels = parcelsListAtom();

    // Если ещё не загружено и нет данных – показываем лоадер
    if (!fetchParcels.ready && parcels.length === 0) {
      return <LinearProgress />;
    }

    if (parcels.length === 0) {
      return (
        <Typography className={cnParcelListContainer()}>
          You don&apos;t have any parcels yet. Create a new one!
        </Typography>
      );
    }

    const handleDeleteParcel = async (id: string) => {
      if (window.confirm('Delete parcel?')) {
        await deleteParcel(id);
      }
    };

    const handleParcelClick = (id: string) => {
      if (selectedParcelIdAtom() === id) {
        selectedParcelIdAtom.set(null);
      } else {
        selectedParcelIdAtom.set(id);
      }
    };

    return (
      <ParcelList
        parcels={parcels}
        selectedParcelId={selectedParcelIdAtom()}
        onClick={handleParcelClick}
        onDelete={handleDeleteParcel}
      />
    );
  };
}, 'ParcelListContainer');
