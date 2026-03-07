import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateAnalysisRequest } from '../api/analysisApi';
import { analysisApi } from '../api/analysisApi';

export const useCreateAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAnalysisRequest) => analysisApi.create(data),
    onSuccess: (_data, _variables) => {
      queryClient.invalidateQueries({ queryKey: ['analyses'] });
    },
  });
};
