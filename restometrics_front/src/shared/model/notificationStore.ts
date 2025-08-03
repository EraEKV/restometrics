import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Notification } from '@/shared/types/notifications'
import { getLS, setLS } from '@/shared/lib/local-storage'

interface NotificationStore {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

const STORAGE_KEY = 'notifications'

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      
      addNotification: (notificationData) => {
        const notification: Notification = {
          ...notificationData,
          id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date()
        }
        
        set((state) => ({
          notifications: [notification, ...state.notifications].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        }))
      },
      
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }))
      },
      
      clearAll: () => {
        set({ notifications: [] })
      }
    }),
    {
      name: STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
        // Состояние уже корректно загружено из localStorage
      }
    }
  )
)
