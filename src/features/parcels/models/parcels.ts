import { action, atom, computed, withActions, withAsyncData } from '@reatom/core';

import type { Parcel } from '#/shared/types/parcel';
import { addNotification } from '#/shared/ui/notification';

import type { CreateParcelRequest } from '../api/parcelsApi';
import { parcelsApi } from '../api/parcelsApi';

// === Atoms ===
export const parcelsAtom = atom<Record<string, Parcel>>({}, 'parcelsAtom');
export const selectedParcelIdAtom = atom<string | null>(null, 'selectedParcelIdAtom');
export const newParcelNameAtom = atom('', 'newParcelNameAtom').extend(
  withActions((target) => ({
    reset: () => target.set(''),
  }))
);

export const isCreateParcelDialogOpenAtom = atom(false, 'isCreateParcelDialogOpenAtom').extend(
  withActions((target) => ({
    open: () => target.set(true),
    close: () => target.set(false),
  }))
);

// === Computed atoms ===
export const parcelsListAtom = computed(() => {
  const map = parcelsAtom();
  return Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
});
export const selectedParcelAtom = computed(() => {
  const id = selectedParcelIdAtom();
  if (!id) return null;
  return parcelsAtom()[id] || null;
});
export const hasSelectedParcelAtom = computed(() => {
  return selectedParcelIdAtom() !== null;
});

// === Actions ===
export const fetchParcels = action(async () => {
  const parcels = await parcelsApi.fetchAll();
  const newMap: Record<string, Parcel> = {};
  parcels.forEach((parcel) => (newMap[parcel.id] = parcel));
  parcelsAtom.set(newMap);
}, 'fetchParcels').extend(
  withAsyncData({
    parseError: (error) => {
      const msg =
        error instanceof Error
          ? `Failed to fetch all parcels: ${error.message}`
          : 'Failed to fetch all parcels';
      addNotification(msg, 'error');
      return new Error(msg);
    },
  })
);

export const createParcel = action(async (data: CreateParcelRequest) => {
  // TODO: replace with real API call
  const newParcel = await parcelsApi.create(data);
  // const newParcel = { id: String(new Date()), ...data };
  parcelsAtom.set((prev) => ({ ...prev, [newParcel.id]: newParcel }));
  selectedParcelIdAtom.set(newParcel.id);
  newParcelNameAtom.reset();
  addNotification(`Parcel "${newParcel.name}" created successfully`, 'success');
  return newParcel;
}, 'createParcel').extend(
  withAsyncData({
    parseError: (error) => {
      const msg =
        error instanceof Error
          ? `Failed to create parcel: ${error.message}`
          : 'Failed to create parcel';
      addNotification(msg, 'error');
      return new Error(msg);
    },
  })
);

export const deleteParcel = action(async (id: string) => {
  await parcelsApi.delete(id);
  parcelsAtom.set((prev) => {
    const { [id]: _, ...rest } = prev;
    return rest;
  });
  if (selectedParcelIdAtom() === id) {
    selectedParcelIdAtom.set(null);
  }
  addNotification(`Parcel "${id}" deleted successfully`, 'success');
}, 'deleteParcel').extend(
  withAsyncData({
    parseError: (error) => {
      const msg =
        error instanceof Error
          ? `Failed to delete parcel: ${error.message}`
          : 'Failed to delete parcel';
      addNotification(msg, 'error');
      return new Error(msg);
    },
  })
);
