import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from './mmkv';
import { Vehicle } from '@/types';

interface VehicleState {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (id: string, updatedVehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  getVehicle: (id: string) => Vehicle | undefined;
  setDefaultVehicle: (id: string) => void;
}

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set, get) => ({
      vehicles: [],
      addVehicle: (vehicle) => set((state) => ({ vehicles: [...state.vehicles, vehicle] })),
      updateVehicle: (id, updatedVehicle) =>
        set((state) => ({
          vehicles: state.vehicles.map((v) => (v.id === id ? { ...v, ...updatedVehicle } : v)),
        })),
      deleteVehicle: (id) =>
        set((state) => ({
          vehicles: state.vehicles.filter((v) => v.id !== id),
        })),
      getVehicle: (id) => get().vehicles.find((v) => v.id === id),
      setDefaultVehicle: (id) => 
        set((state) => ({
          vehicles: state.vehicles.map((v) => ({
            ...v,
            isDefault: v.id === id,
          })),
        })),
    }),
    {
      name: 'vehicle-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
