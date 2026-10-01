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

export type InterpretationReport = {
  total_score: number;
  scale: string;
  scenario: string;
  aspects: AspectInterpretation[];
  top_aspects_summary: string;
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
