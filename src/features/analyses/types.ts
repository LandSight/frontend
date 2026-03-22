export const analysisStatus = ['pending', 'processing', 'completed', 'failed'] as const;
export type AnalysisStatus = (typeof analysisStatus)[number];

export type Analysis = {
  id: string;
  parcel_id: string;
  parcel_name: string;
  name: string;
  status: AnalysisStatus;
  score?: number;
  error?: string;
  created_at: string;
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
