import type { Point } from '#/shared/types';

export type CreateParcelFormProps = {
  polygon: Point[] | null;
  name: string;
  onNameChange: (name: string) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;
};
