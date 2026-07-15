import AsyncStorage from '@react-native-async-storage/async-storage';

export const zustandStorage = {
  setItem: async (name: string, value: string) => {
    return AsyncStorage.setItem(name, value);
  },
  getItem: async (name: string) => {
    const value = await AsyncStorage.getItem(name);
    return value ?? null;
  },
  removeItem: async (name: string) => {
    return AsyncStorage.removeItem(name);
  },
};