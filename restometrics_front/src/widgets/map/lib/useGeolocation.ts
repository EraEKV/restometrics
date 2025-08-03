import { useState, useCallback } from 'react'

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
  defaultLocation?: [number, number]
}

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 300000,
    defaultLocation = [76.9228, 43.2567] // Алматы по умолчанию
  } = options

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getCurrentLocation = useCallback((onSuccess?: (coordinates: [number, number]) => void) => {
    setIsLoading(true)
    setError(null)
    
    if (!navigator.geolocation) {
      const errorMessage = 'Геолокация не поддерживается вашим браузером'
      setError(errorMessage)
      setIsLoading(false)
      
      // Используем местоположение по умолчанию
      setUserLocation(defaultLocation)
      if (onSuccess) {
        onSuccess(defaultLocation)
      }
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords
        const coordinates: [number, number] = [longitude, latitude]
        
        setUserLocation(coordinates)
        setError(null)
        setIsLoading(false)
        
        if (onSuccess) {
          onSuccess(coordinates)
        }
      },
      (error) => {
        console.error('Ошибка получения геолокации:', error)
        const errorMessage = 'Не удалось определить ваше местоположение. Используется местоположение по умолчанию.'
        
        setError(errorMessage)
        setUserLocation(defaultLocation)
        setIsLoading(false)
        
        if (onSuccess) {
          onSuccess(defaultLocation)
        }
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge
      }
    )
  }, [enableHighAccuracy, timeout, maximumAge, defaultLocation])

  return {
    userLocation,
    isLoading,
    error,
    getCurrentLocation
  }
}
