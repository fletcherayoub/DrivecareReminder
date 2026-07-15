import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from './mmkv';

export type ThemeType = 'light' | 'dark' | 'system';
export type UnitType = 'km' | 'mi';

interface SettingsState {
  theme: ThemeType;
  language: string;
  currency: string;
  unit: UnitType;
  notificationsEnabled: boolean;
  setTheme: (theme: ThemeType) => void;
  setLanguage: (lang: string) => void;
  setCurrency: (currency: string) => void;
  setUnit: (unit: UnitType) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'en',
      currency: 'USD',
      unit: 'km',
      notificationsEnabled: true,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
      setUnit: (unit) => set({ unit }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
