import { useEffect } from 'react'
import { useRestaurantStore } from '@/shared/model/restaurantStore'

export const useRestaurantAnalytics = () => {
  const { 
    currentRestaurant, 
    updateRestaurantAnalytics, 
    loadFromStorage 
  } = useRestaurantStore()

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  const updateAnalytics = (analytics: any) => {
    if (currentRestaurant?.registrationId) {
      updateRestaurantAnalytics(currentRestaurant.registrationId, analytics)
    }
  }

  const fetchAnalytics = async () => {
    if (!currentRestaurant) return null

    return {
      totalRevenue: Math.floor(Math.random() * 10000000) + 5000000,
      totalOrders: Math.floor(Math.random() * 1500) + 800,
      averageRating: Math.round((Math.random() * 2 + 3.5) * 10) / 10,
      totalReviews: Math.floor(Math.random() * 600) + 300,
      peakHours: "18:00-20:00",
      bestseller: {
        dish: "Плов узбекский",
        orders: Math.floor(Math.random() * 300) + 200,
        revenue: Math.floor(Math.random() * 500000) + 300000
      },
      todaySpecial: {
        dish: "Бешбармак традиционный",
        description: "Фирменное блюдо с конской колбасой",
        price: 3500
      },
      trendingDish: {
        dish: "Самса с тыквой",
        trend: `+${Math.floor(Math.random() * 50) + 20}%`,
        reason: "Сезонная популярность"
      }
    }
  }

  return {
    currentRestaurant,
    updateAnalytics,
    fetchAnalytics
  }
}
