import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from './mmkv';
import { Expense } from '@/types';

interface ExpenseState {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, updatedExpense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  getExpensesByVehicle: (vehicleId: string) => Expense[];
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      expenses: [],
      addExpense: (expense) => set((state) => ({ expenses: [...state.expenses, expense] })),
      updateExpense: (id, updatedExpense) =>
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...updatedExpense } : e)),
        })),
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),
      getExpensesByVehicle: (vehicleId) => get().expenses.filter((e) => e.vehicleId === vehicleId),
    }),
    {
      name: 'expense-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
