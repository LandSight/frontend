import { action, atom, computed } from '@reatom/core';

import type { Parcel } from '#/shared/types/parcel';
import { addNotification } from '#/shared/ui/notification';

import type { CreateParcelRequest } from '../api/parcelsApi';
import { parcelsApi } from '../api/parcelsApi';

// === Atoms for parcels data ===
export const parcelsAtom = atom<Record<string, Parcel>>({});

// === Loading atoms per operation ===
export const isFetchingAtom = atom(false);
export const isCreatingAtom = atom(false);
export const isDeletingAtom = atom(false);

// === Error atom (shared for simplicity) ===
export const errorAtom = atom<string | null>(null);

errorAtom.subscribe((error) => {
  if (error) {
    addNotification(error, 'error');
  }
});

// === Selection ===
export const selectedParcelIdAtom = atom<string | null>(null);

// === UI state for create parcel dialog ===
export const isCreateParcelDialogOpenAtom = atom(false);
export const newParcelNameAtom = atom('');

// === Actions (non‑trivial) ===
export const fetchParcels = action(async () => {
  isFetchingAtom.set(true);
  errorAtom.set(null);

  try {
    const parcels = await parcelsApi.fetchAll();
    const newMap: Record<string, Parcel> = {};
    parcels.forEach((parcel) => (newMap[parcel.id] = parcel));
    parcelsAtom.set(newMap);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch all parcels';
    errorAtom.set(msg);
    throw err;
  } finally {
    isFetchingAtom.set(false);
  }
});

export const createParcel = action(async (data: CreateParcelRequest) => {
  isCreatingAtom.set(true);
  errorAtom.set(null);

  try {
    // TODO: replace with real API call
    // const newParcel = await parcelsApi.create(data);
    const newParcel = { id: String(new Date()), ...data };
    parcelsAtom.set((prev) => ({ ...prev, [newParcel.id]: newParcel }));
    selectedParcelIdAtom.set(newParcel.id);
    addNotification(`Parcel "${newParcel.name}" created successfully`, 'success');
    return newParcel;
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create parcel';
    errorAtom.set(msg);
    throw err;
  } finally {
    isCreatingAtom.set(false);
  }
});

export const deleteParcel = action(async (id: string) => {
  isDeletingAtom.set(true);
  errorAtom.set(null);

  try {
    await parcelsApi.delete(id);
    parcelsAtom.set((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    if (selectedParcelIdAtom() === id) {
      selectedParcelIdAtom.set(null);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to delete parcel';
    errorAtom.set(msg);
    throw err;
  } finally {
    isDeletingAtom.set(false);
  }
});

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
