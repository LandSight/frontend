import React from 'react';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { IconButton, Tooltip } from '@mui/material';

import { cn } from '#/shared/lib/bem';

import './AnalysisButton.scss';

const cnAnalysisButton = cn('AnalysisButton');

interface AnalysisButtonProps {
  onClick: () => void;
  tooltipTitle?: string;
  className?: string;
}

export const AnalysisButton: React.FC<AnalysisButtonProps> = ({
  onClick,
  tooltipTitle = 'Анализ участка',
  className,
}) => {
  return (
    <div className={cnAnalysisButton(null, [className])}>
      <Tooltip title={tooltipTitle} placement="right">
        <IconButton size="medium" onClick={onClick} className={cnAnalysisButton('Button')}>
          <AnalyticsIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};
