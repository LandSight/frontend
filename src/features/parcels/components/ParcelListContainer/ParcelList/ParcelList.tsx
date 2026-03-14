import React from 'react';
import { Delete } from '@mui/icons-material';
import { IconButton, List, ListItem, ListItemText } from '@mui/material';

import { cn } from '#/shared/lib/bem';

import type { ParcelListProps } from './types';

import './ParcelList.scss';

const cnParcelList = cn('ParcelList');

export const ParcelList: React.FC<ParcelListProps> = ({
  parcels,
  selectedParcelId = null,
  onClick,
  onDelete,
}) => {
  const handleClick = (id: string) => onClick?.(id);
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(id);
  };

  return (
    <List dense className={cnParcelList()}>
      {parcels.map((parcel) => (
        <ListItem
          key={parcel.id}
          className={cnParcelList('Item', { selected: selectedParcelId === parcel.id })}
          onClick={() => handleClick(parcel.id)}
          secondaryAction={
            <>
              {onDelete && (
                <IconButton
                  size="small"
                  onClick={(e) => handleDelete(parcel.id, e)}
                  title="Удалить"
                >
                  <Delete className={cnParcelList('Icon')} fontSize="small" />
                </IconButton>
              )}
            </>
          }
        >
          <ListItemText primary={parcel.name} />
        </ListItem>
      ))}
    </List>
  );
};
