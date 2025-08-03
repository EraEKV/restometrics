import { toast } from 'sonner'
import { useNotificationStore } from '@/shared/model/notificationStore'
import { Notification } from '@/shared/types/notifications'

export const useNotifications = () => {
  const store = useNotificationStore()

  const showDishExpiryNotification = (dishName: string, restaurantId?: string) => {
    const notification: Omit<Notification, 'id' | 'createdAt'> = {
      type: 'dish-expiry',
      title: 'Скоро истечет срок годности',
      message: `Блюдо "${dishName}" скоро будет неактуально`,
      dishName,
      restaurantId
    }

    store.addNotification(notification)

    toast.warning(notification.title, {
      description: notification.message,
      duration: 5000,
      action: {
        label: 'Посмотреть',
        onClick: () => {
          // TODO: Здесь можно добавить навигацию к уведомлениям
        }
      }
    })
  }

  const createTestNotifications = () => {
    const testNotifications = [
      {
        type: 'dish-expiry' as const,
        title: 'Тестовое уведомление',
        message: 'Блюдо "Борщ украинский" скоро будет неактуально. Это тестовое уведомление.',
        dishName: 'Борщ украинский',
        restaurantId: 'test-restaurant'
      },
      {
        type: 'dish-expiry' as const,
        title: 'Еще одно тестовое уведомление',
        message: 'Блюдо "Оливье с креветками" также скоро станет неактуальным. Рекомендуем обновить меню.',
        dishName: 'Оливье с креветками',
        restaurantId: 'test-restaurant'
      }
    ]

    testNotifications.forEach((notification) => {
      store.addNotification(notification)

      toast.warning(notification.title, {
        description: notification.message,
        duration: 5000,
        action: {
          label: 'Посмотреть',
          onClick: () => {
            
          }
        }
      })
    })
  }

  return {
    ...store,
    showDishExpiryNotification,
    createTestNotifications
  }
}
