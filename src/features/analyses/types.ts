export const analysisStatus = ['pending', 'running', 'completed', 'failed'] as const;
export type AnalysisStatus = (typeof analysisStatus)[number];

export const analysisStage = ['metrics', 'scoring'] as const;
export type AnalysisStage = (typeof analysisStage)[number];

export type Analysis = {
  id: string;
  parcel_id: string;
  parcel_name: string | null;
  name: string;
  scenario: string;
  engine: string;
  status: AnalysisStatus;
  stage: AnalysisStage;
  score: number | null;
  status_reason: string | null;
  created_at: string;
};

export type Profile = {
  key: string;
  name: string;
  description: string;
};

export type Engine = {
  key: string;
  name: string;
  description: string;
  version: string;
};

export type MetricContribution = {
  key: string;
  raw_value: number | null;
  normalized_value: number | null;
  weight: number;
  contribution: number | null;
  unit: string;
  data_available: boolean;
  membership_function: string | null;
  membership_params: Record<string, number> | null;
};

export type ClusterScore = {
  key: string;
  score: number;
  weight: number;
  contribution: number;
  subclusters: ClusterScore[];
  metrics: MetricContribution[];
};

export type HierarchicalExtension = {
  clusters: ClusterScore[];
};

export type RuleBasedExtension = {
  base_score: number;
  applied_rules: Record<string, unknown>[];
};

export type ConstraintBasedExtension = {
  applied_constraints: Record<string, unknown>[];
};

export type EvaluationExtensions = {
  hierarchical?: HierarchicalExtension;
  rule_based?: RuleBasedExtension;
  constraint_based?: ConstraintBasedExtension;
};

export type AnalysisEvaluation = {
  scenario: string;
  engine: string;
  model_version: string;
  total_score: number;
  scale: string;
  metadata: {
    evaluated_at: string | null;
    parcel_id: string;
  };
  extensions: EvaluationExtensions;
};

export const analysisStatusLabels: Record<AnalysisStatus, string> = {
  pending: 'Queued',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
};

export const isAnalysisFinished = (status: AnalysisStatus): boolean =>
  status === 'completed' || status === 'failed';

export const sortByFields = ['parcel_name', 'name', 'status', 'created_at', 'score'] as const;
export type SortBy = (typeof sortByFields)[number];

export const sortOrderValues = ['asc', 'desc'] as const;
export type SortOrder = (typeof sortOrderValues)[number];

export type AnalysesFilters = {
  search: string;
  statuses: AnalysisStatus[];
  parcelId: string | null;
  sortBy: SortBy;
  sortOrder: SortOrder;
};
