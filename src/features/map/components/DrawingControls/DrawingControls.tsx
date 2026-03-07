import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import { IconButton, Tooltip } from '@mui/material';

import { useAppDispatch, useAppSelector } from '#/app/store/hooks';
import { setIsDrawing } from '#/app/store/slices/polygon';
import { cn } from '#/shared/lib/bem';

import './DrawingControls.scss';

const cnDrawingControls = cn('DrawingControls');

interface DrawingControlsProps {
  undoLastPoint: () => void;
  clearDrawing: () => void;
  finishDrawing: () => void;
}

export const DrawingControls: React.FC<DrawingControlsProps> = ({
  undoLastPoint,
  clearDrawing,
  finishDrawing,
}) => {
  const dispatch = useAppDispatch();
  const isDrawing = useAppSelector((state) => state.polygon.isDrawing);

  const handleToggleDrawing = () => {
    clearDrawing();
    dispatch(setIsDrawing(!isDrawing));
  };

  const handleUndoLastPoint = () => {
    undoLastPoint();
  };

  const handleClearAll = () => {
    clearDrawing();
  };

  const handleFinishDrawing = () => {
    finishDrawing();
  };

  return (
    <div className={cnDrawingControls()}>
      <Tooltip title={isDrawing ? 'Завершить рисование' : 'Начать рисование'} placement="right">
        <IconButton
          size="medium"
          onClick={handleToggleDrawing}
          className={cnDrawingControls('Button', { active: isDrawing })}
        >
          {isDrawing ? <CloseIcon /> : <EditIcon />}
        </IconButton>
      </Tooltip>

      <Tooltip title="Отменить последнюю точку" placement="right">
        <IconButton
          size="medium"
          onClick={handleUndoLastPoint}
          className={cnDrawingControls('Button')}
        >
          <UndoIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Очистить всё" placement="right">
        <IconButton size="medium" onClick={handleClearAll} className={cnDrawingControls('Button')}>
          <ClearAllIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Завершить рисование" placement="right">
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
