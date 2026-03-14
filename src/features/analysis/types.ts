export const analysisType = ['infrastructure', 'ihb', 'agricultural'] as const;
export const defaultAnalysisType = analysisType[0];
export type AnalysisType = (typeof analysisType)[number];
