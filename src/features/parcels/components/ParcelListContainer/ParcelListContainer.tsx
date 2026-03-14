import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import { useAction, useAtom } from '@reatom/react';

import {
  deleteParcel,
  fetchParcels,
  isFetchingAtom,
  parcelsListAtom,
  selectedParcelIdAtom,
} from '#/features/parcels/models';
import { cn } from '#/shared/lib/bem';

import { ParcelList } from './ParcelList';

import './ParcelListContainer.scss';

const cnParcelListContainer = cn('ParcelListContainer');

export const ParcelListContainer: React.FC = () => {
  const [parcels] = useAtom(parcelsListAtom);
  const [isFetching] = useAtom(isFetchingAtom);
  const [selectedId, setSelectedId] = useAtom(selectedParcelIdAtom);

  const handleFetch = useAction(fetchParcels);
  const handleDelete = useAction(deleteParcel);

  useEffect(() => {
    handleFetch();
  }, []);

  if (isFetching && parcels.length === 0) {
    return <Typography className={cnParcelListContainer()}>Loading...</Typography>;
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
      await handleDelete(id);
    }
  };

  const handleParcelClick = (id: string) => {
    if (selectedId === id) {
      setSelectedId(null);
    } else {
      setSelectedId(id);
    }
  };

  return (
    <ParcelList
      parcels={parcels}
      selectedParcelId={selectedId}
      onClick={handleParcelClick}
      onDelete={handleDeleteParcel}
    />
  );
};
