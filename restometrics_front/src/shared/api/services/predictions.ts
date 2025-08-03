import { axiosInstance } from '../axios-instance'
import { predictionsEndpoints } from '../endpoints/predictions'
import { GeneratePredictionRequest, GeneratePredictionResponse } from '@/shared/types/prediction'

export const predictionsAPI = {
  generatePrediction: (data: GeneratePredictionRequest): Promise<GeneratePredictionResponse> =>
    axiosInstance.post(predictionsEndpoints.generate, data).then(res => res.data),
}
