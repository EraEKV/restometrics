import { useNotifications } from '@/shared/lib/hooks/useNotifications'

export const useTestNotifications = () => {
  const { showDishExpiryNotification } = useNotifications()

  const createTestNotification = () => {
    const dishes = [
      'Борщ красный',
      'Салат Цезарь',
      'Стeak Рибай',
      'Паста Карбонара',
      'Суп Том Кха',
      'Тирамису'
    ]
    
    const randomDish = dishes[Math.floor(Math.random() * dishes.length)]
    showDishExpiryNotification(randomDish, 'restaurant-1')
  }

  const createMultipleTestNotifications = () => {
    const dishes = ['Борщ красный', 'Салат Цезарь', 'Стeak Рибай']
    dishes.forEach((dish, index) => {
      setTimeout(() => {
        showDishExpiryNotification(dish, 'restaurant-1')
      }, index * 1000)
    })
  }

  return {
    createTestNotification,
    createMultipleTestNotifications
  }
}
