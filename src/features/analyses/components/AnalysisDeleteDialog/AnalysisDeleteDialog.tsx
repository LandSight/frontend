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
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import { cn } from '#/shared/lib/bem';

import {
  analysesAtom,
  cancelDeleteAnalysis,
  confirmDeleteAnalysis,
  deleteAnalysis,
  pendingDeleteAnalysisIdAtom,
} from '../../models/analyses';

import './AnalysisDeleteDialog.scss';

const cnAnalysisDeleteDialog = cn('AnalysisDeleteDialog');

export const AnalysisDeleteDialog = reatomComponent(() => {
  const pendingId = pendingDeleteAnalysisIdAtom();
  const analysisName = pendingId ? analysesAtom()[pendingId]?.name : undefined;
  const isLoading = deleteAnalysis.status().isPending;

  return (
    <Dialog
      open={pendingId !== null}
      onClose={isLoading ? undefined : wrap(cancelDeleteAnalysis)}
      maxWidth="xs"
      fullWidth
      PaperProps={{ className: cnAnalysisDeleteDialog('Paper') }}
    >
      <DialogTitle className={cnAnalysisDeleteDialog('Title')}>
        <DeleteIcon />
        Delete analysis
      </DialogTitle>
      <DialogContent className={cnAnalysisDeleteDialog('Content')}>
        <DialogContentText className={cnAnalysisDeleteDialog('Message')}>
          Are you sure you want to permanently delete{' '}
          <strong>{analysisName || 'this analysis'}</strong>? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions className={cnAnalysisDeleteDialog('Actions')}>
        <Button onClick={wrap(cancelDeleteAnalysis)} disabled={isLoading} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={wrap(confirmDeleteAnalysis)}
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
}, 'AnalysisDeleteDialog');
