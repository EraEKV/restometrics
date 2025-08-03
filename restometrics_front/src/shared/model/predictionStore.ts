import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PredictionResponse } from '@/shared/types/prediction'

interface PredictionState {
  currentPrediction: PredictionResponse | null
  isLoading: boolean
  error: string | null
  
  setPrediction: (prediction: PredictionResponse) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearPrediction: () => void
}

export const usePredictionStore = create<PredictionState>()(
  persist(
    (set) => ({
      currentPrediction: null,
      isLoading: false,
      error: null,
      
      setPrediction: (prediction) => set({ currentPrediction: prediction, error: null }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearPrediction: () => set({ currentPrediction: null, error: null }),
    }),
    {
      name: 'prediction-store',
    }
  )
)
