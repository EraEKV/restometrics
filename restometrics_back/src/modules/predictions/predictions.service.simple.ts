import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import {
  PredictionDto,
  PredictionType,
  PredictionPeriod,
  ConfidenceLevel,
} from './dto/prediction.dto';
import { GeneratePredictionDto } from './dto/generate-prediction.dto';
import { BaseResponseDto } from '../../shared/base';
import { FoodCategory, PopularityTrend } from './dto/food-popularity.dto';

@Injectable()
export class PredictionsServiceMock {
  generatePrediction(requestDto: GeneratePredictionDto): BaseResponseDto<PredictionDto> {
    const now = new Date();
    const prediction: PredictionDto = {
      id: uuid(),
      restaurant: {
        name: requestDto.name,
        address: requestDto.address,
        coordinates: {
          lat: requestDto.coordinates.lat,
          lng: requestDto.coordinates.lng,
        },
        dateTime: new Date(requestDto.dateTime),
      },
      predictionDateTime: new Date(requestDto.dateTime),
      predictionType: requestDto.predictionType || PredictionType.REVENUE,
      period: requestDto.period || PredictionPeriod.HOURLY,
      predictedValue: 15750.25,
      unit: 'тенге',
      confidenceLevel: ConfidenceLevel.MEDIUM,
      confidenceScore: 78,
      factors: {
        timeFactors: {
          dayOfWeek: 6,
          hour: 18,
          month: 8,
          isWeekend: true,
          isHoliday: false,
        },
        historicalAverage: 12000,
        seasonalMultiplier: 1.05,
        weekdayMultiplier: 1.3,
        hourMultiplier: 1.4,
        weatherMultiplier: 0.95,
        weatherCondition: 'Небольшой дождь',
      },
      baseValue: 12000,
      description:
        'Прогноз выручки на субботу в 18:00. Ожидается повышенный спрос в вечернее время выходного дня.',
      foodPopularity: [
        {
          category: FoodCategory.HOT_DISHES,
          dishes: ['Плов', 'Бешбармак', 'Манты'],
          trend: PopularityTrend.RISING,
          confidence: 85,
        },
        {
          category: FoodCategory.SOUPS,
          dishes: ['Шурпа', 'Лагман', 'Наурыз көже'],
          trend: PopularityTrend.STABLE,
          confidence: 90,
        },
      ],
      salesGrowth: {
        percentage: 23,
        factors: ['Выходной день увеличивает посещаемость', 'Вечернее время - пик спроса'],
        description: 'Ожидается значительный рост продаж благодаря выходному дню',
      },
      createDate: now,
      updateDate: now,
    };

    return {
      success: true,
      data: prediction,
    };
  }
}
