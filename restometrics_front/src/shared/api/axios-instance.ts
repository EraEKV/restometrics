import axios from 'axios'
import { RequestException } from './request-exception'

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  withCredentials: true,
})

axiosInstance.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = 'en'
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.message || error.message
    return Promise.reject(new RequestException(msg, error.response?.data))
  }
)
