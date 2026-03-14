import type { Point } from '#/shared/types/geometry';

export type Parcel = {
  id: string;
  name: string;
  polygon: Point[];
  createdAt?: string;
  updatedAt?: string;
};
