import { create } from 'zustand'

export interface Restaurant {
  id: string
  name: string
  address: string
  coordinates: [number, number]
  hasMenu: boolean
  rating?: number
  distance?: number
}

export interface FormData {
  selectedRestaurant?: Restaurant
  ownerName?: string
  customRestaurantName?: string
  phone?: string
  email?: string
}

interface FormState {
  step: number
  data: FormData
  isLoading: boolean
  nextStep: () => void
  prevStep: () => void
  setStep: (step: number) => void
  updateData: (values: Partial<FormData>) => void
  setLoading: (loading: boolean) => void
  resetForm: () => void
  getTotalSteps: () => number
  getProgress: () => number
  loadFromLocalStorage: () => void
}

export const useFormStore = create<FormState>((set, get) => ({
  step: 0,
  data: {},
  isLoading: false,
  nextStep: () => {
    const currentStep = get().step
    const totalSteps = get().getTotalSteps()
    if (currentStep < totalSteps - 1) {
      set({ step: currentStep + 1 })
    }
  },
  prevStep: () => {
    const newStep = Math.max(0, get().step - 1)
    set({ step: newStep })
  },
  setStep: (step) => {
    const totalSteps = get().getTotalSteps()
    const newStep = Math.min(Math.max(0, step), totalSteps - 1)
    set({ step: newStep })
  },
  updateData: (values) => {
    const newData = { ...get().data, ...values }
    set({ data: newData })
  },
  setLoading: (loading) => set({ isLoading: loading }),
  resetForm: () => {
    set({ step: 0, data: {}, isLoading: false })
  },
  getTotalSteps: () => 3,
  getProgress: () => {
    const currentStep = get().step
    const totalSteps = get().getTotalSteps()
    return ((currentStep + 1) / totalSteps) * 100
  },
  loadFromLocalStorage: () => {
    // Заглушка для обратной совместимости
  },
}))
