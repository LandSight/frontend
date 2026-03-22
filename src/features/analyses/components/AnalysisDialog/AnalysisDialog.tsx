import React from 'react';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';

import { cn } from '#/shared/lib/bem';

import { AnalysisForm } from './AnalysisForm';
import type { AnalysisDialogProps } from './types';

import './AnalysisDialog.scss';

const cnAnalysisDialog = cn('AnalysisDialog');

export const AnalysisDialog: React.FC<AnalysisDialogProps> = ({
  open,
  onClose,
  selectedParcel,
  analysisName,
  onAnalysisNameChange,
  onRunAnalysis,
  isLoading,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={cnAnalysisDialog('Content')}>
        <AnalysisForm
          selectedParcel={selectedParcel}
          analysisName={analysisName}
          onAnalysisNameChange={onAnalysisNameChange}
          onRunAnalysis={onRunAnalysis}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};
