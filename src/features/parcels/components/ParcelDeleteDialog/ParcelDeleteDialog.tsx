import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { reatomComponent } from '@reatom/react';

import { cn } from '#/shared/lib/bem';

import type { ParcelDeleteDialogProps } from './types';

import './ParcelDeleteDialog.scss';

const cnParcelDeleteDialog = cn('ParcelDeleteDialog');

export const ParcelDeleteDialog = reatomComponent<ParcelDeleteDialogProps>(
  ({ open, parcelName, isLoading = false, onCancel, onConfirm }) => {
    return (
      <Dialog
        open={open}
        onClose={isLoading ? undefined : onCancel}
        maxWidth="xs"
        fullWidth
        PaperProps={{ className: cnParcelDeleteDialog('Paper') }}
      >
        <DialogTitle className={cnParcelDeleteDialog('Title')}>
          <DeleteIcon />
          Delete parcel
        </DialogTitle>
        <DialogContent className={cnParcelDeleteDialog('Content')}>
          <DialogContentText className={cnParcelDeleteDialog('Message')}>
            Are you sure you want to permanently delete{' '}
            <strong>{parcelName || 'this parcel'}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions className={cnParcelDeleteDialog('Actions')}>
          <Button onClick={onCancel} disabled={isLoading} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            color="error"
            variant="contained"
            startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <DeleteIcon />}
          >
            {isLoading ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  },
  'ParcelDeleteDialog'
);
