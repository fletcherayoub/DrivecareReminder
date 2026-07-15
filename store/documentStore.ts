import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from './mmkv';
import { Document } from '@/types';

import { scheduleReminderNotification, cancelReminderNotification } from '@/utils/notifications';

interface DocumentState {
  documents: Document[];
  addDocument: (document: Document) => Promise<void>;
  updateDocument: (id: string, updatedDocument: Partial<Document>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  getDocumentsByVehicle: (vehicleId: string) => Document[];
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set, get) => ({
      documents: [],
      addDocument: async (document) => {
        // Optimistic update
        set((state) => ({ documents: [...state.documents, document] }));

        if (document.expiryDate) {
          const notificationId = await scheduleReminderNotification(
            'Document Expiring',
            `Your ${document.title} is expiring soon.`,
            document.expiryDate
          );
          if (notificationId) {
            set((state) => ({
              documents: state.documents.map((d) => (d.id === document.id ? { ...d, notificationId } : d)),
            }));
          }
        }
      },
      updateDocument: async (id, updatedDocument) => {
        const state = get();
        const existing = state.documents.find((d) => d.id === id);
        if (!existing) return;

        const merged = { ...existing, ...updatedDocument };
        
        // Optimistic update
        set((state) => ({
          documents: state.documents.map((d) => (d.id === id ? merged : d)),
        }));

        if (existing.expiryDate !== merged.expiryDate) {
          if (existing.notificationId) {
            await cancelReminderNotification(existing.notificationId);
            set((state) => ({
              documents: state.documents.map((d) => (d.id === id ? { ...d, notificationId: undefined } : d)),
            }));
          }
          if (merged.expiryDate) {
            const newNotificationId = await scheduleReminderNotification(
              'Document Expiring',
              `Your ${merged.title} is expiring soon.`,
              merged.expiryDate
            );
            if (newNotificationId) {
              set((state) => ({
                documents: state.documents.map((d) => (d.id === id ? { ...d, notificationId: newNotificationId } : d)),
              }));
            }
          }
        }
      },
      deleteDocument: async (id) => {
        const existing = get().documents.find((d) => d.id === id);
        
        // Optimistic update
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
        }));

        if (existing?.notificationId) {
          await cancelReminderNotification(existing.notificationId);
        }
      },
      getDocumentsByVehicle: (vehicleId) => get().documents.filter((d) => d.vehicleId === vehicleId),
    }),
    {
      name: 'document-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
