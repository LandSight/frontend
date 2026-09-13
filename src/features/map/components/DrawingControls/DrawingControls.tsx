import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import { IconButton, Tooltip } from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomFactoryComponent } from '@reatom/react';

import { isDrawingAtom } from '#/features/map/models';
import { cn } from '#/shared/lib/bem';

import type { DrawingControlsProps } from './types';

import './DrawingControls.scss';

const cnDrawingControls = cn('DrawingControls');

export const DrawingControls = reatomFactoryComponent(
  ({ undoLastPoint, clearDrawing, finishDrawing }: DrawingControlsProps) => {
    return () => {
      const isDrawing = isDrawingAtom();

      const handleToggleDrawing = () => {
        clearDrawing();
        wrap(isDrawingAtom.toggle());
      };

      return (
        <div className={cnDrawingControls()}>
          <Tooltip
            title={isDrawing ? 'Decline new polygon' : 'Start new polygon'}
            placement="right"
          >
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
              onClick={undoLastPoint}
              className={cnDrawingControls('Button')}
            >
              <UndoIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Create new parcel" placement="right">
            <IconButton
              size="medium"
              onClick={finishDrawing}
              disabled={!isDrawing}
              className={cnDrawingControls('Button')}
            >
              <CheckIcon />
            </IconButton>
          </Tooltip>
        </div>
      );
    };
  },
  'DrawingControls'
);
