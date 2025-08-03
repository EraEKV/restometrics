export type PredictionType = "revenue" | "orders_count" | "traffic"
export type PredictionPeriod = "hourly" | "daily" | "weekly"

export interface GeneratePredictionRequest {
  name: string
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  dateTime: string
  predictionType?: PredictionType
  period?: PredictionPeriod
}

export interface PredictionResponse {
  id: string
  createDate: string
  updateDate: string
  restaurant: {
    name: string
    address: string
    coordinates: {
      lat: number
      lng: number
    }
    dateTime: string
  }
  predictionDateTime: string
  predictionType: PredictionType
  period: PredictionPeriod
  predictedValue: number
  unit: string
  confidenceLevel: string
  confidenceScore: number
  factors: {
    timeFactors: {
      dayOfWeek: number
      hour: number
      month?: number
      isWeekend: boolean
      isHoliday?: boolean
    }
    historicalAverage: number
    seasonalMultiplier: number
    weekdayMultiplier: number
    hourMultiplier: number
    weatherMultiplier?: number
  }
  baseValue: number
  description: string
  foodPopularity: Array<{
    category: string
    dishes: string[]
    trend: string
    confidence: number
  }>
  salesGrowth: {
    percentage: number
    factors: string[]
    description: string
  }
}

export interface GeneratePredictionResponse {
  success: boolean
  message: string
  data: PredictionResponse
}
