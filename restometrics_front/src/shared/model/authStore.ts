import { create } from 'zustand'
import { authAPI } from '@/shared/api/services'
import { LoginResponse } from '@/shared/api/types'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  registrationId: string | null
  sessionId: string | null
  restaurantId: string | null
  restaurant: LoginResponse['restaurant'] | null
  login: (registrationId: string) => Promise<LoginResponse>
  checkAuth: () => Promise<void>
  logout: () => Promise<void>
  setRegistrationId: (id: string) => void
  loadFromStorage: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isLoading: false,
  registrationId: null,
  sessionId: null,
  restaurantId: null,
  restaurant: null,

  setRegistrationId: (id: string) => {
    set({ registrationId: id })
  },

  login: async (registrationId: string) => {
    set({ isLoading: true })
    try {
      const response = await authAPI.login({ registrationId })
      const authData = {
        isAuthenticated: true, 
        registrationId,
        sessionId: response.sessionId,
        restaurantId: response.restaurantId,
        restaurant: response.restaurant,
        isLoading: false 
      }
      
      set(authData)
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('authData', JSON.stringify(authData))
        localStorage.setItem('restaurantData', JSON.stringify(response.restaurant))
      }
      
      return response
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  checkAuth: async () => {
    set({ isLoading: true })
    try {
      const response = await authAPI.getStatus()
      set({ 
        isAuthenticated: response.data.isAuthenticated,
        registrationId: response.data.user?.registrationId || null,
        isLoading: false 
      })
    } catch (error) {
      set({ 
        isAuthenticated: false, 
        registrationId: null,
        isLoading: false 
      })
    }
  },

  logout: async () => {
    set({ isLoading: true })
    try {
      await authAPI.logout()
      set({ 
        isAuthenticated: false, 
        registrationId: null,
        sessionId: null,
        restaurantId: null,
        restaurant: null,
        isLoading: false 
      })
      
      // Очищаем localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authData')
        localStorage.removeItem('restaurantData')
      }
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  loadFromStorage: () => {
    if (typeof window !== 'undefined') {
      try {
        const authData = localStorage.getItem('authData')
        if (authData) {
          const parsedData = JSON.parse(authData)
          set({
            isAuthenticated: parsedData.isAuthenticated,
            registrationId: parsedData.registrationId,
            sessionId: parsedData.sessionId,
            restaurantId: parsedData.restaurantId,
            restaurant: parsedData.restaurant,
          })
        }
      } catch (error) {
        console.error('Ошибка загрузки данных из localStorage:', error)
      }
    }
  },
}))
