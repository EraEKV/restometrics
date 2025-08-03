import { axiosInstance } from "./axios-instance"

type RequestParams = {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  params?: Record<string, any>
  data?: any
  headers?: Record<string, string>
}

export const requestClient = {
  request: async <T>(config: RequestParams): Promise<{ data: T }> => {
    const response = await axiosInstance.request<T>({
      url: config.url,
      method: config.method,
      params: config.params,
      data: config.data,
      headers: config.headers,
    })
    return { data: response.data }
  },
}