import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityDto } from '../../../shared/base';
import { FoodPopularityDto, SalesGrowthDto } from './food-popularity.dto';

export enum PredictionType {
  REVENUE = 'revenue',
  ORDERS_COUNT = 'orders_count',
  TRAFFIC = 'traffic',
}

export enum PredictionPeriod {
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
}

export enum ConfidenceLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface TimeFactor {
  dayOfWeek: number; // 0-6 (воскресенье-суббота)
  hour: number; // 0-23
  month: number; // 1-12
  isWeekend: boolean;
  isHoliday: boolean;
}

export interface RestaurantInfo {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  dateTime: Date;
}

export interface PredictionFactors {
  timeFactors: TimeFactor;
  historicalAverage: number;
  seasonalMultiplier: number;
  weekdayMultiplier: number;
  hourMultiplier: number;
  weatherMultiplier?: number;
  weatherCondition?: string;
}

export class PredictionDto extends BaseEntityDto {
  @ApiProperty({
    description: 'Информация о ресторане',
    type: 'object',
    properties: {
      name: { type: 'string', example: 'Ресторан "Дастархан"' },
      address: { type: 'string', example: 'ул. Абая, 150, Алматы, Казахстан' },
      coordinates: {
        type: 'object',
        properties: {
          lat: { type: 'number', example: 43.222 },
          lng: { type: 'number', example: 76.8512 },
        },
      },
      dateTime: { type: 'string', format: 'date-time' },
    },
  })
  restaurant: RestaurantInfo;

  @ApiProperty({
    description: 'Дата и время для которого сделан прогноз',
    example: '2025-08-03T18:00:00.000Z',
  })
  predictionDateTime: Date;

  @ApiProperty({
    description: 'Тип прогноза',
    enum: PredictionType,
    example: PredictionType.REVENUE,
  })
  predictionType: PredictionType;

  @ApiProperty({
    description: 'Период прогнозирования',
    enum: PredictionPeriod,
    example: PredictionPeriod.HOURLY,
  })
  period: PredictionPeriod;

  @ApiProperty({
    description: 'Прогнозируемое значение',
    example: 15000.5,
  })
  predictedValue: number;

  @ApiProperty({
    description: 'Единица измерения (рубли, количество заказов, посетители)',
    example: 'рубли',
  })
  unit: string;

  @ApiProperty({
    description: 'Уровень доверия к прогнозу',
    enum: ConfidenceLevel,
    example: ConfidenceLevel.MEDIUM,
  })
  confidenceLevel: ConfidenceLevel;

  @ApiProperty({
    description: 'Процент уверенности в прогнозе (0-100)',
    example: 75,
    minimum: 0,
    maximum: 100,
  })
  confidenceScore: number;

  @ApiProperty({
    description: 'Факторы, учтенные при создании прогноза',
    example: {
      timeFactors: {
        dayOfWeek: 5,
        hour: 18,
        month: 8,
        isWeekend: false,
        isHoliday: false,
      },
      historicalAverage: 12000,
      seasonalMultiplier: 1.1,
      weekdayMultiplier: 1.2,
      hourMultiplier: 1.5,
    },
  })
  factors: PredictionFactors;

  @ApiProperty({
    description: 'Базовое значение без корректировок',
    example: 10000,
  })
  baseValue: number;

  @ApiProperty({
    description: 'Описание прогноза на русском языке',
    example: 'Прогноз выручки на пятницу в 18:00. Ожидается повышенный спрос в вечернее время.',
  })
  description: string;

  @ApiProperty({
    description: 'Прогноз популярности блюд',
    type: [FoodPopularityDto],
    required: false,
  })
  foodPopularity?: FoodPopularityDto[];

  @ApiProperty({
    description: 'Прогноз роста продаж',
    type: SalesGrowthDto,
    required: false,
  })
  salesGrowth?: SalesGrowthDto;
}
