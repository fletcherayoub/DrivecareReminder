import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from './mmkv';
import { FuelLog } from '@/types';

interface FuelState {
  fuelLogs: FuelLog[];
  addFuelLog: (log: FuelLog) => void;
  updateFuelLog: (id: string, updatedLog: Partial<FuelLog>) => void;
  deleteFuelLog: (id: string) => void;
  getLogsByVehicle: (vehicleId: string) => FuelLog[];
}

export const useFuelStore = create<FuelState>()(
  persist(
    (set, get) => ({
      fuelLogs: [],
      addFuelLog: (log) => set((state) => ({ fuelLogs: [...state.fuelLogs, log] })),
      updateFuelLog: (id, updatedLog) =>
        set((state) => ({
          fuelLogs: state.fuelLogs.map((l) => (l.id === id ? { ...l, ...updatedLog } : l)),
        })),
      deleteFuelLog: (id) =>
        set((state) => ({
          fuelLogs: state.fuelLogs.filter((l) => l.id !== id),
        })),
      getLogsByVehicle: (vehicleId) => get().fuelLogs.filter((l) => l.vehicleId === vehicleId),
    }),
    {
      name: 'fuel-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
