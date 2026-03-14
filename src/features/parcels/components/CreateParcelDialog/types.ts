import type { Point } from '#/shared/types';

export type CreateParcelDialogProps = {
  open: boolean;
  onClose: () => void;
  polygon: Point[] | null;
  name: string;
  onNameChange: (name: string) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
};
