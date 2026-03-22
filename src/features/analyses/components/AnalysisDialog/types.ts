import type { Parcel } from '#/shared/types/parcel';

export type AnalysisDialogProps = {
  open: boolean;
  onClose: () => void;
  selectedParcel: Parcel | null;
  analysisName: string;
  onAnalysisNameChange: (name: string) => void;
  onRunAnalysis: (data: { name: string; parcel_id: string }) => Promise<void>;
  isLoading: boolean;
};
