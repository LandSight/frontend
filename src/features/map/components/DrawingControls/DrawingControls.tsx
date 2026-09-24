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
          <Tooltip title={isDrawing ? 'Decline new polygon' : 'Start new polygon'} placement="left">
            <IconButton
              size="small"
              onClick={handleToggleDrawing}
              className={cnDrawingControls('Button', { active: isDrawing })}
            >
              {isDrawing ? <CloseIcon fontSize="small" /> : <EditIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Decline last point" placement="left">
            <IconButton
              size="small"
              onClick={undoLastPoint}
              className={cnDrawingControls('Button')}
            >
              <UndoIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Create new parcel" placement="left">
            <span>
              <IconButton
                size="small"
                onClick={finishDrawing}
                disabled={!isDrawing}
                className={cnDrawingControls('Button')}
              >
                <CheckIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      );
    };
  },
  'DrawingControls'
);
