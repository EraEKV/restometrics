export interface Notification {
  id: string
  type: 'dish-expiry'
  title: string
  message: string
  dishName: string
  restaurantId?: string
  createdAt: Date
}

export type NotificationStatus = 'all'
