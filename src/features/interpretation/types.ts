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

export const suitabilityVerdicts = [
  'very_high',
  'high',
  'medium',
  'low',
  'very_low',
  'prohibited',
] as const;
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
  // Every metric of the aspect: strengths, then weaknesses, then metrics without data.
  metrics: MetricInfo[];
};

export const constraintEffects = ['prohibit', 'penalty'] as const;
export type ConstraintEffect = (typeof constraintEffects)[number];

export type ConstraintInterpretation = {
  kind: string;
  label: string;
  effect: ConstraintEffect;
  // Multiplier applied to the score: 0 for a prohibition.
  factor: number;
  // Share of the parcel inside the zone, in [0, 1].
  overlap_share: number;
  zone_names: string[];
  legal_basis: string;
  // Share of the score the zone takes away on its own (1 - factor).
  score_reduction: number;
  // Points of the total score attributed to the zone; all zones add up to constraints_loss.
  points_lost: number;
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
  // Score of the aspects before the restriction zones.
  base_score: number | null;
  constraints_loss: number;
  constraints_explanation: string;
  // Prohibitions first, then by points lost.
  constraints: ConstraintInterpretation[];
};
