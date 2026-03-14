export const analysisType = ['infrastructure', 'ihb', 'agricultural'] as const;
export const defaultAnalysisType = analysisType[0];
export type AnalysisType = (typeof analysisType)[number];

export const analysisStatus = ['pending', 'processing', 'completed', 'failed'] as const;
export type AnalysisStatus = (typeof analysisStatus)[number];

export type Analysis = {
  id: string;
  parcel_id: string;
  parcel_name: string;
  type: AnalysisType;
  status: AnalysisStatus;
  score?: number;
  error?: string;
  created_at: string;
};

// Sorting
export const sortByFields = ['created_at', 'score'] as const;
export type SortBy = (typeof sortByFields)[number];

export const sortOrderValues = ['asc', 'desc'] as const;
export type SortOrder = (typeof sortOrderValues)[number];
