import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './mmkv';

interface AdState {
  environment: 'dev' | 'prod';
  setEnvironment: (env: 'dev' | 'prod') => void;
}

export const useAdStore = create<AdState>()(
  persist(
    (set) => ({
      environment: __DEV__ ? 'dev' : 'prod',
      setEnvironment: (environment) => set({ environment }),
    }),
    {
      name: 'ad-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
