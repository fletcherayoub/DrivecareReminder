import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from './mmkv';
import { MaintenanceRecord } from '@/types';

interface MaintenanceState {
  records: MaintenanceRecord[];
  addRecord: (record: MaintenanceRecord) => void;
  updateRecord: (id: string, updatedRecord: Partial<MaintenanceRecord>) => void;
  deleteRecord: (id: string) => void;
  getRecordsByVehicle: (vehicleId: string) => MaintenanceRecord[];
}

export const useMaintenanceStore = create<MaintenanceState>()(
  persist(
    (set, get) => ({
      records: [],
      addRecord: (record) => set((state) => ({ records: [...state.records, record] })),
      updateRecord: (id, updatedRecord) =>
        set((state) => ({
          records: state.records.map((r) => (r.id === id ? { ...r, ...updatedRecord } : r)),
        })),
      deleteRecord: (id) =>
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        })),
      getRecordsByVehicle: (vehicleId) => get().records.filter((r) => r.vehicleId === vehicleId),
    }),
    {
      name: 'maintenance-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
