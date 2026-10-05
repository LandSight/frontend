export const metricRoles = ['strong', 'weak', 'neutral'] as const;
export type MetricRole = (typeof metricRoles)[number];

export type MetricInfo = {
  key: string;
  label: string;
  raw_value: number | null;
  normalized_value: number | null;
  contribution: number | null;
  unit: string;
  role: MetricRole;
};

export type AspectInterpretation = {
  key: string;
  name: string;
  score: number;
  weight: number;
  contribution: number;
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
};
