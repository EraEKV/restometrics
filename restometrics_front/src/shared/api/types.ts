export interface BaseApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

export interface ErrorResponse {
  statusCode: number
  message: string | string[]
  error: string
}

export * from '../types/prediction'

export interface ValidationError {
  field: string
  message: string
}

export interface LoginRequest {
  registrationId: string
}

export interface LoginResponse {
  message: string
  restaurantId: string
  sessionId: string
  restaurant: {
    id: string
    name: string
    address: string
    coordinates: [number, number]
    hasMenu: boolean
    registrationId: string
    customName: string | null
    owner: {
      name: string
      phone: string
      email: string
    }
    status: 'pending' | 'approved' | 'rejected'
    mapId: string | null
    createDate: string
    updateDate: string
  }
}

export interface AuthStatusResponse {
  isAuthenticated: boolean
  user?: {
    id: string
    registrationId: string
  }
}

export interface CreateRestaurantRequest {
  name: string
  address: string
  coordinates: [number, number]
  registrationId: string
  owner: {
    name: string
    phone: string
    email: string
  }
}

export interface UpdateRestaurantRequest {
  name: string
  address: string
  coordinates: [number, number]
  hasMenu?: boolean
  customName?: string
  owner: {
    name: string
    phone: string
    email: string
  }
  mapId?: string
}

export interface Restaurant {
  id: string
  name: string
  address: string
  coordinates: [number, number]
  registrationId: string
  status: string
  owner: {
    name: string
    phone: string
    email: string
  }
}