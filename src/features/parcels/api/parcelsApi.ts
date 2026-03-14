import apiClient from '#/shared/api/client';
import type { Point } from '#/shared/types/geometry';
import type { Parcel } from '#/shared/types/parcel';

export interface CreateParcelRequest {
  polygon: Point[];
  name: string;
}

export type UpdateParcelRequest = {
  id: string;
  name?: string;
};

export type CreateParcelResponse = Parcel;
export type UpdateParcelResponse = Parcel;
const mockParcels: Parcel[] = [
  {
    id: '1',
    name: 'Петроградская сторона',
    polygon: [
      { lat: 59.955, lng: 30.315 },
      { lat: 59.958, lng: 30.32 },
      { lat: 59.952, lng: 30.328 },
      { lat: 59.95, lng: 30.318 },
    ],
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'Васильевский остров',
    polygon: [
      { lat: 59.94, lng: 30.27 },
      { lat: 59.945, lng: 30.275 },
      { lat: 59.938, lng: 30.282 },
      { lat: 59.935, lng: 30.272 },
    ],
    createdAt: '2024-01-12',
  },
  {
    id: '3',
    name: 'Купчино',
    polygon: [
      { lat: 59.83, lng: 30.375 },
      { lat: 59.835, lng: 30.38 },
      { lat: 59.828, lng: 30.388 },
      { lat: 59.825, lng: 30.378 },
    ],
    createdAt: '2024-01-15',
  },
  {
    id: '4',
    name: 'Парнас',
    polygon: [
      { lat: 60.07, lng: 30.35 },
      { lat: 60.075, lng: 30.355 },
      { lat: 60.068, lng: 30.363 },
      { lat: 60.065, lng: 30.353 },
    ],
    createdAt: '2024-01-20',
  },
  {
    id: '5',
    name: 'Репино',
    polygon: [
      { lat: 60.17, lng: 29.87 },
      { lat: 60.175, lng: 29.88 },
      { lat: 60.168, lng: 29.885 },
      { lat: 60.165, lng: 29.875 },
    ],
    createdAt: '2024-02-01',
  },
  {
    id: '6',
    name: 'Сестрорецк',
    polygon: [
      { lat: 60.1, lng: 29.97 },
      { lat: 60.105, lng: 29.98 },
      { lat: 60.098, lng: 29.985 },
      { lat: 60.095, lng: 29.975 },
    ],
    createdAt: '2024-02-05',
  },
  {
    id: '7',
    name: 'Колпино',
    polygon: [
      { lat: 59.75, lng: 30.59 },
      { lat: 59.755, lng: 30.6 },
      { lat: 59.748, lng: 30.605 },
      { lat: 59.745, lng: 30.595 },
    ],
    createdAt: '2024-02-10',
  },
  {
    id: '8',
    name: 'Пушкин',
    polygon: [
      { lat: 59.72, lng: 30.41 },
      { lat: 59.725, lng: 30.42 },
      { lat: 59.718, lng: 30.425 },
      { lat: 59.715, lng: 30.415 },
    ],
    createdAt: '2024-02-15',
  },
  {
    id: '9',
    name: 'Кронштадт',
    polygon: [
      { lat: 60.0, lng: 29.76 },
      { lat: 60.005, lng: 29.77 },
      { lat: 59.998, lng: 29.775 },
      { lat: 59.995, lng: 29.765 },
    ],
    createdAt: '2024-02-20',
  },
  {
    id: '10',
    name: 'Лахта',
    polygon: [
      { lat: 60.0, lng: 30.18 },
      { lat: 60.005, lng: 30.19 },
      { lat: 59.998, lng: 30.195 },
      { lat: 59.995, lng: 30.185 },
    ],
    createdAt: '2024-02-25',
  },
  {
    id: '11',
    name: 'Шувалово',
    polygon: [
      { lat: 60.04, lng: 30.28 },
      { lat: 60.045, lng: 30.29 },
      { lat: 60.038, lng: 30.295 },
      { lat: 60.035, lng: 30.285 },
    ],
    createdAt: '2024-03-01',
  },
  {
    id: '12',
    name: 'Гатчина',
    polygon: [
      { lat: 59.57, lng: 30.13 },
      { lat: 59.575, lng: 30.14 },
      { lat: 59.568, lng: 30.145 },
      { lat: 59.565, lng: 30.135 },
    ],
    createdAt: '2024-03-05',
  },
];

export const parcelsApi = {
  fetchAll: async (): Promise<Parcel[]> => {
    // return [];
    return mockParcels;
    // const response = await apiClient.get<Parcel[]>('/parcels');
    // return response.data;
  },

  create: async (data: CreateParcelRequest): Promise<CreateParcelResponse> => {
    const response = await apiClient.post<CreateParcelResponse>('/parcels', data);
    return response.data;
  },

  update: async (data: UpdateParcelRequest): Promise<UpdateParcelResponse> => {
    const response = await apiClient.patch<UpdateParcelResponse>(`/parcels/${data.id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/parcels/${id}`);
  },
};
