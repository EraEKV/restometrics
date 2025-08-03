import { useFormStore } from '@/shared/model/formStore'
import { useRestaurantStore } from '@/shared/model/restaurantStore'

export const useRestaurantFormModel = () => {
  const { step, getProgress, loadFromLocalStorage } = useFormStore()
  const { loadFromStorage } = useRestaurantStore()

  return {
    step,
    getProgress,
    loadFromLocalStorage,
    loadFromStorage
  }
}
