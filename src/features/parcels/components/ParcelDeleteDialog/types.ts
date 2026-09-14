export type ParcelDeleteDialogProps = {
  open: boolean;
  parcelName?: string;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};
