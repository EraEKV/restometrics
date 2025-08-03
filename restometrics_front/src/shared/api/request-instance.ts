import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { axiosInstance } from './axios-instance'
import { RequestException } from './request-exception'

export class RequestInstance {
  async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await axiosInstance.request<T>(config)
    } catch (e) {
      if (e instanceof RequestException) {
        // TODO: глобальный toast позже
        console.error(e.message)
      }
      throw e
    }
  }
}

export const requestInstance = new RequestInstance()
