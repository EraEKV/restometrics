import { requestInstance } from '../request-instance'

export interface LoginRequest {
  registrationId: string
}

export interface AuthUser {
  id: string
  registrationId: string
  restaurantId?: string
}

export interface AuthStatusResponse {
  success: boolean
  authenticated: boolean
  user?: AuthUser
}

export const authService = {
  async login(data: LoginRequest): Promise<void> {
    await requestInstance.request({
      method: 'POST',
      url: '/api/auth/login',
      data,
    })
  },

  async getStatus(): Promise<AuthStatusResponse> {
    const response = await requestInstance.request<AuthStatusResponse>({
      method: 'GET',
      url: '/api/auth/status',
    })
    return response.data
  },

  async logout(): Promise<void> {
    await requestInstance.request({
      method: 'POST',
      url: '/api/auth/logout',
    })
  },
}
