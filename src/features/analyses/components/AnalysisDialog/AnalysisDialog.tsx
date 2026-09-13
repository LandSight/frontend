import AssessmentIcon from '@mui/icons-material/Assessment';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import { isAnalysisDialogOpenAtom } from '#/features/analyses/models/analyses';
import { cn } from '#/shared/lib/bem';

import { AnalysisForm } from './AnalysisForm';

import './AnalysisDialog.scss';

const cnAnalysisDialog = cn('AnalysisDialog');

export const AnalysisDialog = reatomComponent(() => {
  const open = isAnalysisDialogOpenAtom();

  return (
    <Dialog
      open={open}
      onClose={wrap(isAnalysisDialogOpenAtom.close)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: cnAnalysisDialog('Paper'),
      }}
    >
      <DialogTitle className={cnAnalysisDialog('Title')}>
        <span className={cnAnalysisDialog('TitleContent')}>
          <AssessmentIcon className={cnAnalysisDialog('TitleIcon')} sx={{ fontSize: '32px' }} />
          Parcel analysis
        </span>
        <IconButton onClick={wrap(isAnalysisDialogOpenAtom.close)} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={cnAnalysisDialog('Content')}>
        <AnalysisForm />
      </DialogContent>
    </Dialog>
  );
}, 'AnalysisDialog');
