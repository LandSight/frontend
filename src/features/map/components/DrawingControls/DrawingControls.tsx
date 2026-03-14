import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import { IconButton, Tooltip } from '@mui/material';
import { useAtom } from '@reatom/react';

import { isDrawingAtom } from '#/features/map/models';
import { cn } from '#/shared/lib/bem';

import type { DrawingControlsProps } from './types';

import './DrawingControls.scss';

const cnDrawingControls = cn('DrawingControls');

export const DrawingControls: React.FC<DrawingControlsProps> = ({
  undoLastPoint,
  clearDrawing,
  finishDrawing,
}) => {
  const [isDrawing, setIsDrawing] = useAtom(isDrawingAtom);

  const handleToggleDrawing = () => {
    clearDrawing();
    setIsDrawing(!isDrawing);
  };

  const handleUndoLastPoint = () => {
    undoLastPoint();
  };

  const handleFinishDrawing = () => {
    finishDrawing();
  };

  return (
    <div className={cnDrawingControls()}>
      <Tooltip title={isDrawing ? 'Decline new polygon' : 'Start new polygon'} placement="right">
        <IconButton
          size="medium"
          onClick={handleToggleDrawing}
          className={cnDrawingControls('Button', { active: isDrawing })}
        >
          {isDrawing ? <CloseIcon /> : <EditIcon />}
        </IconButton>
      </Tooltip>

      <Tooltip title="Decline last pint" placement="right">
        <IconButton
          size="medium"
          onClick={handleUndoLastPoint}
          className={cnDrawingControls('Button')}
        >
          <UndoIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Create new parcel" placement="right">
        <IconButton
          size="medium"
          onClick={handleFinishDrawing}
          disabled={!isDrawing}
          className={cnDrawingControls('Button')}
        >
          <CheckIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};
