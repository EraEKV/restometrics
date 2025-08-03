import { useMutation } from '@tanstack/react-query'
import { restaurantApi, RestaurantRegistrationRequest, RestaurantRegistrationResponse } from '@/shared/api/endpoints/restaurants'
import { toast } from 'sonner'

export const useRestaurantRegistration = () => {
  return useMutation({
    mutationFn: (data: RestaurantRegistrationRequest) => {
      // Используем мок функцию для демонстрации
      // В продакшене заменить на restaurantApi.registerRestaurant(data)
      return restaurantApi.mockRegisterRestaurant(data)
    },
    onSuccess: (data: RestaurantRegistrationResponse) => {
      toast.success(data.message || 'Ресторан успешно зарегистрирован!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Произошла ошибка при регистрации')
    },
  })
}
