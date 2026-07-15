import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from './mmkv';
import { Reminder } from '@/types';
import { scheduleReminderNotification, cancelReminderNotification } from '@/utils/notifications';

interface ReminderState {
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => Promise<void>;
  updateReminder: (id: string, updatedReminder: Partial<Reminder>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  getRemindersByVehicle: (vehicleId: string) => Reminder[];
}

export const useReminderStore = create<ReminderState>()(
  persist(
    (set, get) => ({
      reminders: [],
      addReminder: async (reminder) => {
        // Optimistic update
        set((state) => ({ reminders: [...state.reminders, reminder] }));

        if (reminder.notificationEnabled && reminder.dueDate) {
          const notificationId = await scheduleReminderNotification(
            reminder.title,
            `This maintenance task is due soon.`,
            reminder.dueDate
          );
          if (notificationId) {
            set((state) => ({
              reminders: state.reminders.map((r) => (r.id === reminder.id ? { ...r, notificationId } : r)),
            }));
          }
        }
      },
      updateReminder: async (id, updatedReminder) => {
        const state = get();
        const existing = state.reminders.find((r) => r.id === id);
        if (!existing) return;

        const merged = { ...existing, ...updatedReminder };
        
        // Optimistic update
        set((state) => ({
          reminders: state.reminders.map((r) => (r.id === id ? merged : r)),
        }));

        // If dates or toggle changed, reschedule in the background
        if (
          existing.dueDate !== merged.dueDate ||
          existing.notificationEnabled !== merged.notificationEnabled
        ) {
          if (existing.notificationId) {
            await cancelReminderNotification(existing.notificationId);
            // Clear it just in case scheduling fails
            set((state) => ({
              reminders: state.reminders.map((r) => (r.id === id ? { ...r, notificationId: undefined } : r)),
            }));
          }
          if (merged.notificationEnabled && merged.dueDate) {
            const newNotificationId = await scheduleReminderNotification(
              merged.title,
              `This maintenance task is due soon.`,
              merged.dueDate
            );
            if (newNotificationId) {
              set((state) => ({
                reminders: state.reminders.map((r) => (r.id === id ? { ...r, notificationId: newNotificationId } : r)),
              }));
            }
          }
        }
      },
      deleteReminder: async (id) => {
        const existing = get().reminders.find((r) => r.id === id);
        
        // Optimistic update
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        }));

        if (existing?.notificationId) {
          await cancelReminderNotification(existing.notificationId);
        }
      },
      getRemindersByVehicle: (vehicleId) => get().reminders.filter((r) => r.vehicleId === vehicleId),
    }),
    {
      name: 'reminder-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
