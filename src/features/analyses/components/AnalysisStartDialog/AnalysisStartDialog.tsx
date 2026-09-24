import AssessmentIcon from '@mui/icons-material/Assessment';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import { isAnalysisDialogOpenAtom } from '#/features/analyses/models/analyses';
import { cn } from '#/shared/lib/bem';

import { AnalysisForm } from './AnalysisForm';

import './AnalysisStartDialog.scss';

const cnAnalysisStartDialog = cn('AnalysisStartDialog');

export const AnalysisStartDialog = reatomComponent(() => {
  const open = isAnalysisDialogOpenAtom();

  return (
    <Dialog
      open={open}
      onClose={wrap(isAnalysisDialogOpenAtom.close)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: cnAnalysisStartDialog('Paper'),
      }}
    >
      <DialogTitle className={cnAnalysisStartDialog('Title')}>
        <span className={cnAnalysisStartDialog('TitleContent')}>
          <AssessmentIcon
            className={cnAnalysisStartDialog('TitleIcon')}
            sx={{ fontSize: '32px' }}
          />
          Start analysis
        </span>
        <IconButton onClick={wrap(isAnalysisDialogOpenAtom.close)} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={cnAnalysisStartDialog('Content')}>
        <AnalysisForm />
      </DialogContent>
    </Dialog>
  );
}, 'AnalysisStartDialog');
