import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import { clearDrawingState } from '#/features/map/models';
import { isCreateParcelDialogOpenAtom, newParcelNameAtom } from '#/features/parcels/models';
import { cn } from '#/shared/lib/bem';

import { CreateParcelForm } from './CreateParcelForm';

import './CreateParcelDialog.scss';

const cnCreateParcelDialog = cn('CreateParcelDialog');

export const CreateParcelDialog = reatomComponent(() => {
  const open = isCreateParcelDialogOpenAtom();

  const handleClose = () => {
    wrap(isCreateParcelDialogOpenAtom.close());
    wrap(newParcelNameAtom.reset());
    wrap(clearDrawingState());
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={cnCreateParcelDialog('Content')}>
        <CreateParcelForm />
      </DialogContent>
    </Dialog>
  );
}, 'CreateParcelDialog');
