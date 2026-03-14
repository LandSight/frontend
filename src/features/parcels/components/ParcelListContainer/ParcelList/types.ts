import type { Parcel } from '#/shared/types';

export type ParcelListProps = {
  parcels: Parcel[];
  selectedParcelId?: string | null;
  onClick?: (id: string) => void;
  onDelete?: (id: string) => void;
};
