import { requestInstance } from '../request-instance'
import { BaseApiResponse, CreateRestaurantRequest, UpdateRestaurantRequest, Restaurant } from '../types'

export class RestaurantAPI {
  async create(data: CreateRestaurantRequest): Promise<BaseApiResponse<Restaurant>> {
    const response = await requestInstance.request({
      method: 'POST',
      url: '/api/restaurants',
      data,
    })
    return response.data
  }

  async update(restaurantId: string, data: UpdateRestaurantRequest): Promise<BaseApiResponse<Restaurant>> {
    const response = await requestInstance.request({
      method: 'PUT',
      url: `/api/restaurants`,
      data,
    })
    return response.data
  }

  async getById(id: string): Promise<BaseApiResponse<Restaurant>> {
    const response = await requestInstance.request({
      method: 'GET',
      url: `/api/restaurants/${id}`,
    })
    return response.data
  }

  async getMy(): Promise<BaseApiResponse<Restaurant>> {
    const response = await requestInstance.request({
      method: 'GET',
      url: '/api/restaurants',
    })
    return response.data
  }
}

export const restaurantAPI = new RestaurantAPI()
