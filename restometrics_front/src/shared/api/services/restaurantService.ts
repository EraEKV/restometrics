import { requestInstance } from '../request-instance'
import { FormData } from '@/shared/model/formStore'
import { setLS, getLS } from '@/shared/lib/local-storage'

export interface RestaurantRegistrationRequest {
  selectedRestaurant: {
    id: string
    name: string
    address: string
    coordinates: [number, number]
    hasMenu: boolean
    rating?: number
  }
  ownerName: string
  customRestaurantName?: string
  phone: string
  email?: string
}

export interface RestaurantRegistrationResponse {
  success: boolean
  restaurantId: string
  message: string
  data?: {
    id: string
    name: string
    status: 'pending' | 'approved' | 'rejected'
    createdAt: string
  }
}

const REGISTRATION_CACHE_KEY = 'restaurant-registration-result'

export const restaurantService = {
  async registerRestaurant(data: RestaurantRegistrationRequest): Promise<RestaurantRegistrationResponse> {
    try {
      setLS('restaurant-registration-data', data)
      const response = await this.mockRegisterRestaurant(data)
      setLS(REGISTRATION_CACHE_KEY, response)
      
      return response
    } catch (error) {
      console.error('Ошибка при регистрации ресторана:', error)
      throw new Error('Не удалось зарегистрировать ресторан')
    }
  },

  async mockRegisterRestaurant(data: RestaurantRegistrationRequest): Promise<RestaurantRegistrationResponse> {
    await new Promise(resolve => setTimeout(resolve, 2000))

    if (Math.random() < 0.1) {
      throw new Error('Сервер временно недоступен')
    }
    
    const result: RestaurantRegistrationResponse = {
      success: true,
      restaurantId: `rest_${Date.now()}`,
      message: 'Ресторан успешно зарегистрирован!',
      data: {
        id: `rest_${Date.now()}`,
        name: data.customRestaurantName || data.selectedRestaurant.name,
        status: 'approved', // Сразу утверждаем регистрацию
        createdAt: new Date().toISOString()
      }
    }
    
    return result
  },

  getLastRegistrationResult(): RestaurantRegistrationResponse | null {
    return getLS<RestaurantRegistrationResponse>(REGISTRATION_CACHE_KEY)
  },

  clearRegistrationCache(): void {
    setLS(REGISTRATION_CACHE_KEY, null)
    setLS('restaurant-registration-data', null)
  }
}
