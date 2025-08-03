import { create } from 'zustand'
import { restaurantAPI } from '@/shared/api/services'
import { Restaurant, CreateRestaurantRequest, UpdateRestaurantRequest } from '@/shared/api/types'

interface RestaurantAnalytics {
  totalRevenue: number
  totalOrders: number
  averageRating: number
  totalReviews: number
  peakHours: string
  bestseller?: {
    dish: string
    orders: number
    revenue: number
  }
  todaySpecial?: {
    dish: string
    description: string
    price: number
  }
  trendingDish?: {
    dish: string
    trend: string
    reason: string
  }
}

interface RegisteredRestaurant extends Restaurant {
  registrationId: string
  customName?: string
  owner: {
    name: string
    phone: string
    email: string
  }
  status: 'pending' | 'approved' | 'rejected'
  registeredAt: string
  analytics?: RestaurantAnalytics
}

interface RestaurantState {
  restaurant: Restaurant | null
  isLoading: boolean
  isCreating: boolean
  isUpdating: boolean
  currentRestaurant: RegisteredRestaurant | null
  
  createRestaurant: (data: CreateRestaurantRequest) => Promise<Restaurant>
  updateRestaurant: (restaurantId: string, data: UpdateRestaurantRequest) => Promise<Restaurant>
  getMyRestaurant: () => Promise<void>
  clear: () => void
  
  addRegisteredRestaurant: (restaurant: RegisteredRestaurant) => void
  updateRestaurantAnalytics: (id: string, analytics: RestaurantAnalytics) => void
  loadFromStorage: () => void
  getDashboardData: () => any
}

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  restaurant: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  currentRestaurant: null,

  createRestaurant: async (data: CreateRestaurantRequest) => {
    set({ isCreating: true })
    try {
      const response = await restaurantAPI.create(data)
      set({ 
        restaurant: response.data,
        isCreating: false 
      })
      return response.data
    } catch (error) {
      set({ isCreating: false })
      throw error
    }
  },

  updateRestaurant: async (restaurantId: string, data: UpdateRestaurantRequest) => {
    set({ isUpdating: true })
    try {
      const response = await restaurantAPI.update(restaurantId, data)
      set({ 
        restaurant: response.data,
        isUpdating: false 
      })
      return response.data
    } catch (error) {
      set({ isUpdating: false })
      throw error
    }
  },

  getMyRestaurant: async () => {
    set({ isLoading: true })
    try {
      const response = await restaurantAPI.getMy()
      set({ 
        restaurant: response.data,
        isLoading: false 
      })
    } catch (error) {
      set({ 
        restaurant: null,
        isLoading: false 
      })
      throw error
    }
  },

  clear: () => {
    set({ restaurant: null, currentRestaurant: null })
  },

  addRegisteredRestaurant: (restaurant: RegisteredRestaurant) => {
    set({ currentRestaurant: restaurant })
  },

  updateRestaurantAnalytics: (id: string, analytics: RestaurantAnalytics) => {
    const { currentRestaurant } = get()
    if (currentRestaurant?.registrationId === id) {
      set({ 
        currentRestaurant: { 
          ...currentRestaurant, 
          analytics 
        } 
      })
    }
  },

  loadFromStorage: () => {
    if (typeof window !== 'undefined') {
      try {
        const restaurantData = localStorage.getItem('restaurantData')
        if (restaurantData) {
          const parsedData = JSON.parse(restaurantData)
          set({ restaurant: parsedData })
        }
      } catch (error) {
        console.error('Ошибка загрузки данных ресторана из localStorage:', error)
      }
    }
  },

  getDashboardData: () => {
    const { restaurant } = get()
    if (!restaurant) return null

    return {
      restaurant,
      analytics: {
        totalRevenue: 2500000,
        totalOrders: 1234,
        averageRating: 4.8,
        totalReviews: 256,
        peakHours: "12:00-14:00, 19:00-21:00",
        bestseller: {
          dish: "Плов узбекский",
          orders: 245,
          revenue: 490000
        },
        todaySpecial: {
          dish: "Манты с тыквой",
          description: "Сезонное блюдо с местной тыквой",
          price: 1200
        },
        trendingDish: {
          dish: "Лагман домашний",
          trend: "↗ +15%",
          reason: "Популярно в холодную погоду"
        }
      }
    }
  },
}))
