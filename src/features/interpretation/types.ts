export const metricRoles = ['strong', 'weak', 'neutral'] as const;
export type MetricRole = (typeof metricRoles)[number];

export const valuePositions = [
  'optimal',
  'partial_low',
  'partial_high',
  'out_low',
  'out_high',
  'unknown',
] as const;
export type ValuePosition = (typeof valuePositions)[number];

export const suitabilityVerdicts = ['very_high', 'high', 'medium', 'low', 'very_low'] as const;
export type SuitabilityVerdict = (typeof suitabilityVerdicts)[number];

export type MetricInfo = {
  key: string;
  label: string;
  raw_value: number | null;
  normalized_value: number | null;
  contribution: number | null;
  unit: string;
  role: MetricRole;
  position: ValuePosition;
  membership_function: string | null;
  membership_params: Record<string, number> | null;
};

export type AspectInterpretation = {
  key: string;
  name: string;
  score: number;
  weight: number;
  contribution: number;
  points: number;
  max_points: number;
  loss: number;
  loss_share: number;
  explanation: string;
  top_metrics: MetricInfo[];
};

export const interpretationStatusValues = ['ordered', 'running', 'completed', 'failed'] as const;
export type InterpretationStatus = (typeof interpretationStatusValues)[number];

export type InterpretationReport = {
  total_score: number;
  scale_max: number;
  scenario: string;
  status: InterpretationStatus;
  aspects: AspectInterpretation[];
  top_aspects_summary: string;
  verdict: SuitabilityVerdict | null;
  verdict_label: string | null;
};
