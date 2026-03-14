import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';

import { cn } from '#/shared/lib/bem';

import { CreateParcelForm } from './CreateParcelForm';
import type { CreateParcelDialogProps } from './types';

import './CreateParcelDialog.scss';

const cnCreateParcelDialog = cn('CreateParcelDialog');

export const CreateParcelDialog: React.FC<CreateParcelDialogProps> = ({
  open,
  onClose,
  polygon,
  name,
  onNameChange,
  onSubmit,
  isLoading,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: cnCreateParcelDialog('Paper'),
      }}
    >
      <DialogTitle className={cnCreateParcelDialog('Title')}>
        <span className={cnCreateParcelDialog('TitleContent')}>
          <AddIcon className={cnCreateParcelDialog('TitleIcon')} sx={{ fontSize: '32px' }} />
          Create new parcel
        </span>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={cnCreateParcelDialog('Content')}>
        <CreateParcelForm
          polygon={polygon}
          name={name}
          onNameChange={onNameChange}
          onSubmit={onSubmit}
          isLoading={isLoading}
          disabled={!polygon || polygon.length === 0}
        />
      </DialogContent>
    </Dialog>
  );
};
