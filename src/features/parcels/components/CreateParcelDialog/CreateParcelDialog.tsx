import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';

import { cn } from '#/shared/lib/bem';

import { CreateParcelForm } from './CreateParcelForm';

import './CreateParcelDialog.scss';

const cnCreateParcelDialog = cn('CreateParcelDialog');

export interface CreateParcelDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CreateParcelDialog: React.FC<CreateParcelDialogProps> = ({ open, onClose }) => {
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
        <CreateParcelForm />
      </DialogContent>
    </Dialog>
  );
};
