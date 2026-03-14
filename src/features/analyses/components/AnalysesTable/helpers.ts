import type { AnalysisStatus, AnalysisType } from '#/features/analyses/types';

export const analysisTypeMap: Record<AnalysisType, string> = {
  infrastructure: 'Infrastructure',
  ihb: 'IHB',
  agricultural: 'Agricultural',
};

export const analysisStatusMap: Record<AnalysisStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  completed: 'Completed',
  failed: 'Failed',
};

export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
