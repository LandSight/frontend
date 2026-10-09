import type { SvgIconComponent } from '@mui/icons-material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import VerifiedIcon from '@mui/icons-material/Verified';
import type { ChipProps } from '@mui/material';

import type { InterpretationStatus, MetricRole, SuitabilityVerdict, ValuePosition } from './types';

export const metricRoleLabels: Record<MetricRole, string> = {
  strong: 'strong',
  weak: 'weak',
  neutral: 'neutral',
};

export const metricRoleColors: Record<MetricRole, ChipProps['color']> = {
  strong: 'success',
  weak: 'error',
  neutral: 'default',
};

export const valuePositionLabels: Record<ValuePosition, string | null> = {
  optimal: 'optimal',
  partial_low: 'below optimal',
  partial_high: 'above optimal',
  out_low: 'below threshold',
  out_high: 'above threshold',
  unknown: null,
};

export const verdictIcons: Record<SuitabilityVerdict, SvgIconComponent> = {
  very_high: VerifiedIcon,
  high: CheckCircleIcon,
  medium: RemoveCircleIcon,
  low: ReportProblemIcon,
  very_low: CancelIcon,
};

export const generatingMessages: Partial<Record<InterpretationStatus, string>> = {
  ordered: 'The report has been queued for generation… This usually takes a few minutes.',
  running:
    'The report is being generated… This usually takes a few minutes. In the meantime, you can review the assessment results on the "Evaluation" tab.',
  failed: 'Failed to generate the report. Try generating it again.',
};

export const noReportMessage = 'No report has been generated for this analysis yet.';

// An aspect that lost at least this share of its maximum points is flagged
// as a severe loss.
export const LOSS_SEVERE_SHARE = 0.5;
