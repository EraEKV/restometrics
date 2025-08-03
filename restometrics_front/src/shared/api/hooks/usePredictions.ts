import { useMutation, useQuery } from '@tanstack/react-query'
import { predictionsAPI } from '../services'
import { GeneratePredictionRequest } from '@/shared/types/prediction'

export const usePredictions = () => {
  const generatePredictionMutation = useMutation({
    mutationFn: predictionsAPI.generatePrediction,
    mutationKey: ['predictions', 'generate'],
  })

  const generatePrediction = async (data: GeneratePredictionRequest) => {
    return generatePredictionMutation.mutateAsync(data)
  }

  return {
    generatePrediction,
    isGenerating: generatePredictionMutation.isPending,
    generateError: generatePredictionMutation.error,
  }
}
