import { requestInstance } from '../request-instance'
import { BaseApiResponse, LoginRequest, LoginResponse, AuthStatusResponse } from '../types'

export class AuthAPI {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await requestInstance.request<LoginResponse>({
      method: 'POST',
      url: '/api/auth/login',
      data,
    })
    return response.data
  }

  async getStatus(): Promise<BaseApiResponse<AuthStatusResponse>> {
    const response = await requestInstance.request({
      method: 'GET',
      url: '/api/auth/status',
    })
    return response.data
  }

  async logout(): Promise<BaseApiResponse<void>> {
    const response = await requestInstance.request({
      method: 'POST',
      url: '/api/auth/logout',
    })
    return response.data
  }
}

export const authAPI = new AuthAPI()
