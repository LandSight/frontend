export const analysisStatus = ['pending', 'running', 'completed', 'failed'] as const;
export type AnalysisStatus = (typeof analysisStatus)[number];

export const analysisStage = ['metrics', 'scoring'] as const;
export type AnalysisStage = (typeof analysisStage)[number];

export type Analysis = {
  id: string;
  parcel_id: string;
  parcel_name: string | null;
  name: string;
  status: AnalysisStatus;
  stage: AnalysisStage;
  score: number | null;
  status_reason: string | null;
  created_at: string;
};

export const analysisStatusLabels: Record<AnalysisStatus, string> = {
  pending: 'Queued',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
};

export const sortByFields = ['parcel_name', 'name', 'status', 'created_at', 'score'] as const;
export type SortBy = (typeof sortByFields)[number];

export const sortOrderValues = ['asc', 'desc'] as const;
export type SortOrder = (typeof sortOrderValues)[number];

export type AnalysesFilters = {
  search: string;
  statuses: AnalysisStatus[];
  sortBy: SortBy;
  sortOrder: SortOrder;
};
