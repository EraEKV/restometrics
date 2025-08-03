import { requestInstance } from '../request-instance'

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

export const restaurantApi = {
  async registerRestaurant(data: RestaurantRegistrationRequest): Promise<RestaurantRegistrationResponse> {
    try {
      const response = await requestInstance.request<RestaurantRegistrationResponse>({
        method: 'POST',
        url: '/api/restaurants/register',
        data
      })
      
      return response.data
    } catch (error) {
      console.error('Ошибка при регистрации ресторана:', error)
      throw new Error('Не удалось зарегистрировать ресторан')
    }
  },

  async mockRegisterRestaurant(data: RestaurantRegistrationRequest): Promise<RestaurantRegistrationResponse> {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    return {
      success: true,
      restaurantId: `rest_${Date.now()}`,
      message: 'Ресторан успешно зарегистрирован!',
      data: {
        id: `rest_${Date.now()}`,
        name: data.customRestaurantName || data.selectedRestaurant.name,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    }
  }
}
