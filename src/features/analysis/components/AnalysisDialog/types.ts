import type { AnalysisType } from '#/features/analysis/types';
import type { Parcel } from '#/shared/types/parcel';

export type AnalysisDialogProps = {
  open: boolean;
  onClose: () => void;
  selectedParcel: Parcel | null;
  analysisType: AnalysisType;
  onAnalysisTypeChange: (type: AnalysisType) => void;
  onRunAnalysis: (data: { type: AnalysisType; parcel_id: string }) => Promise<void>;
  isLoading: boolean;
};
