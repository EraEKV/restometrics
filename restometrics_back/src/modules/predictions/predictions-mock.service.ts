import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import {
  PredictionDto,
  PredictionType,
  PredictionPeriod,
  ConfidenceLevel,
  TimeFactor,
  PredictionFactors,
} from './dto/prediction.dto';
import { PredictionRequestDto } from './dto/prediction-request.dto';
import { BaseResponseDto } from '../../shared/base';
import {
  FoodPopularityDto,
  SalesGrowthDto,
  FoodCategory,
  PopularityTrend,
} from './dto/food-popularity.dto';

interface Multipliers {
  seasonal: number;
  weekday: number;
  hour: number;
  weather: number;
  total: number;
}

@Injectable()
export class PredictionsServiceMock {
  /**
   * Генерирует прогноз без обращения к базе данных
   */
  generatePrediction(requestDto: PredictionRequestDto): BaseResponseDto<PredictionDto> {
    const predictionDateTime = requestDto.predictionDateTime || new Date();
    const predictionType = requestDto.predictionType || PredictionType.REVENUE;
    const period = requestDto.period || PredictionPeriod.HOURLY;

    const timeFactors = this.getTimeFactors(predictionDateTime);

    const baseValues = this.getBaseValues(predictionType);

    const multipliers = this.calculateMultipliers(timeFactors);

    const predictedValue = Math.round(baseValues.base * multipliers.total * 100) / 100;

    const factors: PredictionFactors = {
      timeFactors,
      historicalAverage: baseValues.base,
      seasonalMultiplier: multipliers.seasonal,
      weekdayMultiplier: multipliers.weekday,
      hourMultiplier: multipliers.hour,
      weatherMultiplier: multipliers.weather,
      weatherCondition: this.getRandomWeatherCondition(),
    };

    const confidenceScore = this.calculateConfidence(timeFactors, multipliers);
    const confidenceLevel = this.getConfidenceLevel(confidenceScore);

    const description = this.generateDescription(predictionType, timeFactors, predictedValue);

    const foodPopularity = this.generateFoodPopularity();

    const salesGrowth = this.generateSalesGrowth(timeFactors, factors);

    const prediction: PredictionDto = {
      id: uuid(),
      restaurant: {
        name: 'Ресторан "Дастархан"',
        address: 'ул. Абая, 150, Алматы, Казахстан',
        coordinates: {
          lat: 43.222,
          lng: 76.8512,
        },
        dateTime: new Date(),
      },
      predictionDateTime,
      predictionType,
      period,
      predictedValue,
      unit: this.getUnit(predictionType),
      confidenceLevel,
      confidenceScore,
      factors,
      baseValue: baseValues.base,
      description,
      foodPopularity,
      salesGrowth,
      createDate: new Date(),
      updateDate: new Date(),
    };

    return {
      success: true,
      data: prediction,
    };
  }

  private getTimeFactors(date: Date): TimeFactor {
    const dayOfWeek = date.getDay();
    const hour = date.getHours();
    const month = date.getMonth() + 1;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const holidays = [
      '01-01',
      '01-02',
      '03-08',
      '03-21',
      '03-22',
      '05-01',
      '05-07',
      '05-09',
      '07-06',
      '08-30',
      '12-01',
      '12-16',
      '12-17',
    ];
    const dateStr = `${String(month).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const isHoliday = holidays.includes(dateStr);

    return {
      dayOfWeek,
      hour,
      month,
      isWeekend,
      isHoliday,
    };
  }

  private getBaseValues(type: PredictionType) {
    switch (type) {
      case PredictionType.REVENUE:
        return { base: 12000, min: 8000, max: 25000 };
      case PredictionType.ORDERS_COUNT:
        return { base: 45, min: 20, max: 80 };
      case PredictionType.TRAFFIC:
        return { base: 120, min: 60, max: 200 };
      default:
        return { base: 12000, min: 8000, max: 25000 };
    }
  }

  private calculateMultipliers(timeFactors: TimeFactor) {
    const seasonalMultiplier = this.getSeasonalMultiplier(timeFactors.month);

    const weekdayMultiplier = timeFactors.isWeekend
      ? 1.3
      : timeFactors.isHoliday
        ? 1.5
        : timeFactors.dayOfWeek === 5
          ? 1.2
          : 1.0;

    const hourMultiplier = this.getHourMultiplier(timeFactors.hour);

    const weatherMultiplier = 0.85 + Math.random() * 0.3;

    const total = seasonalMultiplier * weekdayMultiplier * hourMultiplier * weatherMultiplier;

    return {
      seasonal: Math.round(seasonalMultiplier * 100) / 100,
      weekday: Math.round(weekdayMultiplier * 100) / 100,
      hour: Math.round(hourMultiplier * 100) / 100,
      weather: Math.round(weatherMultiplier * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }

  private getSeasonalMultiplier(month: number): number {
    if ([12, 1, 2].includes(month)) return 1.1;
    if ([3, 4, 5].includes(month)) return 1.05;
    if ([6, 7, 8].includes(month)) return 0.95;
    return 1.0;
  }

  private getHourMultiplier(hour: number): number {
    // Пиковые часы
    if (hour >= 12 && hour <= 14) return 1.4;
    if (hour >= 18 && hour <= 20) return 1.5;
    if (hour >= 8 && hour <= 10) return 1.2;
    if (hour >= 21 && hour <= 23) return 1.1;
    // Непиковые часы
    return 0.7;
  }

  private calculateConfidence(timeFactors: TimeFactor, multipliers: Multipliers): number {
    let confidence = 70;

    if (timeFactors.hour >= 12 && timeFactors.hour <= 14) confidence += 10;
    if (timeFactors.hour >= 18 && timeFactors.hour <= 20) confidence += 10;
    if (timeFactors.hour < 6 || timeFactors.hour > 23) confidence -= 20;
    if (multipliers.total > 1.5 || multipliers.total < 0.7) confidence -= 15;

    return Math.max(40, Math.min(95, confidence));
  }

  private getConfidenceLevel(score: number): ConfidenceLevel {
    if (score >= 80) return ConfidenceLevel.HIGH;
    if (score >= 60) return ConfidenceLevel.MEDIUM;
    return ConfidenceLevel.LOW;
  }

  private getUnit(type: PredictionType): string {
    switch (type) {
      case PredictionType.REVENUE:
        return 'тенге';
      case PredictionType.ORDERS_COUNT:
        return 'заказов';
      case PredictionType.TRAFFIC:
        return 'посетителей';
      default:
        return 'единиц';
    }
  }

  private generateDescription(
    type: PredictionType,
    timeFactors: TimeFactor,
    value: number,
  ): string {
    const dayNames = [
      'воскресенье',
      'понедельник',
      'вторник',
      'среда',
      'четверг',
      'пятница',
      'суббота',
    ];
    const dayName = dayNames[timeFactors.dayOfWeek];

    const timeOfDay =
      timeFactors.hour < 12
        ? 'утреннее время'
        : timeFactors.hour < 17
          ? 'дневное время'
          : timeFactors.hour < 21
            ? 'вечернее время'
            : 'позднее время';

    const typeText =
      type === PredictionType.REVENUE
        ? 'выручки'
        : type === PredictionType.ORDERS_COUNT
          ? 'количества заказов'
          : 'посещаемости';

    return (
      `Прогноз ${typeText} на ${dayName} в ${timeFactors.hour}:00. ` +
      `${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} ${timeFactors.isWeekend ? 'выходного дня' : 'рабочего дня'}.`
    );
  }

  private generateFoodPopularity(): FoodPopularityDto[] {
    const categories = [
      {
        category: FoodCategory.HOT_DISHES,
        dishes: ['Плов', 'Бешбармак', 'Манты', 'Лагман'],
        trend: PopularityTrend.RISING,
        confidence: 85,
      },
      {
        category: FoodCategory.SOUPS,
        dishes: ['Шурпа', 'Наурыз көже', 'Мастава'],
        trend: PopularityTrend.STABLE,
        confidence: 90,
      },
      {
        category: FoodCategory.MEAT_DISHES,
        dishes: ['Казы', 'Шашлык', 'Куырдак'],
        trend: PopularityTrend.RISING,
        confidence: 80,
      },
      {
        category: FoodCategory.BEVERAGES,
        dishes: ['Чай', 'Кофе', 'Кумыс', 'Шубат'],
        trend: PopularityTrend.STABLE,
        confidence: 88,
      },
    ];

    return categories.sort(() => 0.5 - Math.random()).slice(0, 3);
  }

  private generateSalesGrowth(timeFactors: TimeFactor, factors: PredictionFactors): SalesGrowthDto {
    const baseGrowth = 5;
    let growthPercentage = baseGrowth;

    const growthFactors: string[] = [];

    if (timeFactors.isWeekend) {
      growthPercentage += 10;
      growthFactors.push('Выходной день увеличивает посещаемость');
    }

    if (timeFactors.hour >= 18 && timeFactors.hour <= 20) {
      growthPercentage += 8;
      growthFactors.push('Вечернее время - пик спроса');
    }

    if (factors.weatherMultiplier && factors.weatherMultiplier < 1.0) {
      growthPercentage += 5;
      growthFactors.push('Плохая погода привлекает в закрытые заведения');
    }

    if (timeFactors.isHoliday) {
      growthPercentage += 15;
      growthFactors.push('Праздничный день значительно увеличивает спрос');
    }

    const description =
      growthPercentage > 15
        ? 'Ожидается значительный рост продаж'
        : growthPercentage > 8
          ? 'Ожидается умеренный рост продаж'
          : 'Ожидается стабильная динамика продаж';

    return {
      percentage: Math.round(growthPercentage),
      factors: growthFactors.length > 0 ? growthFactors : ['Стандартные рыночные условия'],
      description,
    };
  }

  private getRandomWeatherCondition(): string {
    const conditions = [
      'Ясно',
      'Облачно',
      'Небольшой дождь',
      'Снег',
      'Туман',
      'Ветрено',
      'Солнечно',
    ];
    return conditions[Math.floor(Math.random() * conditions.length)];
  }
}
