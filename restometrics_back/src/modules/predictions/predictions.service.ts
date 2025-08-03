import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { DatabaseService } from '../../core/database';
import {
  PredictionDto,
  PredictionType,
  PredictionPeriod,
  ConfidenceLevel,
  TimeFactor,
  PredictionFactors,
} from './dto/prediction.dto';
import { PredictionRequestDto } from './dto/prediction-request.dto';
import { GeneratePredictionDto } from './dto/generate-prediction.dto';
import { BaseResponseDto } from '../../shared/base';
import { WeatherService, WeatherDataDto, WeatherImpact } from '../external-data';
import { GeminiService } from '../external-data/gemini.service';
import {
  FoodPopularityDto,
  SalesGrowthDto,
  FoodCategory,
  PopularityTrend,
} from './dto/food-popularity.dto';

interface PredictionCalculationResult {
  predictedValue: number;
  confidenceScore: number;
  confidenceLevel: ConfidenceLevel;
  factors: PredictionFactors;
  baseValue: number;
  description: string;
  weatherData?: WeatherDataDto;
  foodPopularity?: FoodPopularityDto[];
  salesGrowth?: SalesGrowthDto;
}

@Injectable()
export class PredictionsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly weatherService: WeatherService,
    private readonly geminiService: GeminiService,
  ) {}

  /**
   * Получить временные факторы для указанной даты
   */
  private getTimeFactors(date: Date): TimeFactor {
    const dayOfWeek = date.getDay();
    const hour = date.getHours();
    const month = date.getMonth() + 1;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const holidays = [
      '01-01', // Новый год
      '01-02', // Новый год
      '01-07', // Рождество (православное)
      '03-08', // Международный женский день
      '03-21', // Наурыз мейрамы
      '03-22', // Наурыз мейрамы
      '03-23', // Наурыз мейрамы
      '05-01', // Праздник единства народа Казахстана
      '05-07', // День защитника Отечества
      '05-09', // День Победы
      '07-06', // День Столицы
      '08-30', // День Конституции Республики Казахстан
      '12-01', // День Первого Президента
      '12-16', // День Независимости
      '12-17', // День Независимости
    ];

    const monthDay = `${String(month).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const isHoliday = holidays.includes(monthDay);

    return {
      dayOfWeek,
      hour,
      month,
      isWeekend,
      isHoliday,
    };
  }

  /**
   * Рассчитать базовое значение для прогноза на основе типа (для казахстанского рынка)
   */
  private getBaseValue(predictionType: PredictionType): number {
    switch (predictionType) {
      case PredictionType.REVENUE:
        return 150000;
      case PredictionType.ORDERS_COUNT:
        return 45;
      case PredictionType.TRAFFIC:
        return 85;
      default:
        return 10000;
    }
  }

  /**
   * Получить единицу измерения для типа прогноза
   */
  private getUnit(predictionType: PredictionType): string {
    switch (predictionType) {
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

  /**
   * Рассчитать мультипликатор для дня недели (адаптировано для Казахстана)
   */
  private getWeekdayMultiplier(timeFactors: TimeFactor): number {
    if (timeFactors.isHoliday) return 0.6; // Праздники - значительно меньше посетителей

    // В Казахстане рабочая неделя похожа на российскую, но есть нюансы:
    // Понедельник - четверг: обычная активность
    // Пятница: повышенная активность (но меньше чем суббота)
    // Суббота: максимальная активность
    // Воскресенье: умеренная активность
    const multipliers = [0.85, 1.0, 1.0, 1.0, 1.1, 1.4, 1.3]; // Вс-Сб
    return multipliers[timeFactors.dayOfWeek];
  }

  /**
   * Рассчитать мультипликатор для времени суток
   */
  private getHourMultiplier(hour: number): number {
    // Завтрак (7-11): 0.8
    // Обед (12-15): 1.4
    // Ужин (18-22): 1.6
    // Остальное время: 0.3
    if (hour >= 7 && hour <= 11) return 0.8; // Завтрак
    if (hour >= 12 && hour <= 15) return 1.4; // Обед
    if (hour >= 18 && hour <= 22) return 1.6; // Ужин
    if (hour >= 16 && hour <= 17) return 0.6; // Между обедом и ужином
    return 0.3; // Ночное время
  }

  /**
   * Рассчитать сезонный мультипликатор (для Казахстана)
   */
  private getSeasonalMultiplier(month: number): number {
    // Казахстан - континентальный климат с суровой зимой и жарким летом
    // Зимние месяцы (декабрь, январь, февраль): люди реже выходят, но кафе/рестораны популярны
    // Весна (март-май): активность растет
    // Лето (июнь-август): пик активности из-за отпусков и хорошей погоды
    // Осень (сентябрь-ноябрь): снижение активности
    const multipliers = [1.1, 1.0, 1.1, 1.2, 1.3, 1.4, 1.4, 1.3, 1.1, 1.0, 0.9, 1.0];
    return multipliers[month - 1];
  }

  /**
   * Рассчитать уровень доверия на основе факторов
   */
  private calculateConfidenceLevel(score: number): ConfidenceLevel {
    if (score >= 80) return ConfidenceLevel.HIGH;
    if (score >= 60) return ConfidenceLevel.MEDIUM;
    return ConfidenceLevel.LOW;
  }

  /**
   * Основная логика расчета прогноза с учетом погоды и AI-анализа популярности блюд
   */
  private async calculatePrediction(
    predictionType: PredictionType,
    predictionDateTime: Date,
    latitude?: number,
    longitude?: number,
  ): Promise<PredictionCalculationResult> {
    const timeFactors = this.getTimeFactors(predictionDateTime);
    const baseValue = this.getBaseValue(predictionType);

    const weekdayMultiplier = this.getWeekdayMultiplier(timeFactors);
    const hourMultiplier = this.getHourMultiplier(timeFactors.hour);
    const seasonalMultiplier = this.getSeasonalMultiplier(timeFactors.month);

    // Получаем погодные данные, если есть координаты
    let weatherData: WeatherDataDto | undefined;
    let weatherMultiplier = 1.0;

    if (latitude && longitude) {
      try {
        weatherData = await this.weatherService.getWeatherData(
          latitude,
          longitude,
          predictionDateTime,
        );
        weatherMultiplier = weatherData.impactMultiplier;
      } catch (error) {
        console.warn('Не удалось получить погодные данные:', error);
        weatherMultiplier = 1.0;
      }
    }

    // Получаем прогноз популярности блюд и роста продаж от Gemini AI
    let foodPopularity: FoodPopularityDto[] | undefined;
    let salesGrowth: SalesGrowthDto | undefined;

    try {
      const geminiInput = {
        hour: timeFactors.hour,
        dayOfWeek: timeFactors.dayOfWeek,
        isWeekend: timeFactors.isWeekend,
        isHoliday: timeFactors.isHoliday,
        seasonMultiplier: seasonalMultiplier,
        weather: weatherData,
        city: 'Алматы', // TODO: получать из настроек ресторана
      };

      const geminiResult = await this.geminiService.predictFoodPopularityAndSales(geminiInput);
      foodPopularity = geminiResult.foodPopularity;
      salesGrowth = geminiResult.salesGrowth;

      if (salesGrowth?.percentage) {
        const geminiMultiplier = 1 + salesGrowth.percentage / 100;
        weatherMultiplier *= geminiMultiplier;
      }
    } catch (error) {
      console.warn('Не удалось получить прогноз от Gemini AI:', error);
    }

    const predictedValue = Math.round(
      baseValue * weekdayMultiplier * hourMultiplier * seasonalMultiplier * weatherMultiplier,
    );

    let confidenceScore = 70;

    if (timeFactors.hour >= 12 && timeFactors.hour <= 15) confidenceScore += 15;
    if (timeFactors.hour >= 18 && timeFactors.hour <= 21) confidenceScore += 15;
    if (timeFactors.hour >= 23 || timeFactors.hour <= 6) confidenceScore -= 20;
    if (timeFactors.isWeekend) confidenceScore += 5;
    if (timeFactors.isHoliday) confidenceScore -= 10;

    if (weatherData) {
      if (weatherData.impact === WeatherImpact.POSITIVE) confidenceScore += 5;
      if (weatherData.impact === WeatherImpact.NEGATIVE) confidenceScore -= 10;
    }

    if (foodPopularity && foodPopularity.length > 0) {
      confidenceScore += 5;
    }

    confidenceScore = Math.max(30, Math.min(95, confidenceScore));

    const factors: PredictionFactors = {
      timeFactors,
      historicalAverage: baseValue,
      seasonalMultiplier,
      weekdayMultiplier,
      hourMultiplier,
      weatherMultiplier,
      weatherCondition: weatherData?.description,
    };

    const description = this.generateDescription(predictionType, timeFactors, weatherData);

    return {
      predictedValue,
      confidenceScore,
      confidenceLevel: this.calculateConfidenceLevel(confidenceScore),
      factors,
      baseValue,
      description,
      weatherData,
      foodPopularity,
      salesGrowth,
    };
  }

  /**
   * Генерация описания прогноза с учетом погоды
   */
  private generateDescription(
    predictionType: PredictionType,
    timeFactors: TimeFactor,
    weatherData?: WeatherDataDto,
  ): string {
    const days = [
      'воскресенье',
      'понедельник',
      'вторник',
      'среду',
      'четверг',
      'пятницу',
      'субботу',
    ];
    const dayName = days[timeFactors.dayOfWeek];

    const typeText =
      predictionType === PredictionType.REVENUE
        ? 'выручки'
        : predictionType === PredictionType.ORDERS_COUNT
          ? 'количества заказов'
          : 'посещаемости';

    let description = `Прогноз ${typeText} на ${dayName} в ${timeFactors.hour}:00.`;

    if (timeFactors.isHoliday) {
      description += ' В праздничные дни ожидается снижение активности.';
    } else if (timeFactors.isWeekend) {
      description += ' В выходные дни ожидается повышенная активность.';
    }

    if (timeFactors.hour >= 12 && timeFactors.hour <= 15) {
      description += ' Обеденное время - пик активности.';
    } else if (timeFactors.hour >= 18 && timeFactors.hour <= 21) {
      description += ' Ужин - время максимальной активности.';
    }

    if (weatherData) {
      description += ` ${weatherData.description}`;
    }

    return description;
  }

  /**
   * Создать прогноз
   */
  async generatePrediction(
    requestDto: PredictionRequestDto,
  ): Promise<BaseResponseDto<PredictionDto>> {
    try {
      const predictionDateTime = requestDto.predictionDateTime || new Date();
      const predictionType = requestDto.predictionType || PredictionType.REVENUE;
      const period = requestDto.period || PredictionPeriod.HOURLY;

      // TODO: В будущем добавить проверку существования ресторана
      // if (requestDto.restaurantId) {
      //   const restaurant = await this.databaseService.db
      //     .selectFrom('restaurants')
      //     .where('id', '=', requestDto.restaurantId)
      //     .selectAll()
      //     .executeTakeFirst();

      //   if (!restaurant) {
      //     throw new NotFoundException('Ресторан не найден');
      //   }
      // }

      const defaultCoords = this.weatherService.getCityCoordinates('алматы');
      const latitude = defaultCoords?.latitude;
      const longitude = defaultCoords?.longitude;

      const calculation = await this.calculatePrediction(
        predictionType,
        predictionDateTime,
        latitude,
        longitude,
      );

      const predictionDto: PredictionDto = {
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
        predictedValue: calculation.predictedValue,
        unit: this.getUnit(predictionType),
        confidenceLevel: calculation.confidenceLevel,
        confidenceScore: calculation.confidenceScore,
        factors: calculation.factors,
        baseValue: calculation.baseValue,
        description: calculation.description,
        represent: `Прогноз ${this.getUnit(predictionType)} на ${predictionDateTime.toLocaleString('ru-RU')}`,
        createDate: new Date(),
        updateDate: new Date(),
        foodPopularity: calculation.foodPopularity,
        salesGrowth: calculation.salesGrowth,
      };

      return BaseResponseDto.success(predictionDto, 'Прогноз успешно создан');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error generating prediction:', error);
      throw new BadRequestException('Ошибка при создании прогноза');
    }
  }

  /**
   * Получить прогноз для текущего ресторана из сессии
   */
  async getCurrentRestaurantPrediction(
    restaurantId: string,
    requestDto: PredictionRequestDto,
  ): Promise<BaseResponseDto<PredictionDto>> {
    const modifiedRequest = { ...requestDto, restaurantId };
    return this.generatePrediction(modifiedRequest);
  }

  /**
   * Генерация прогноза с использованием Gemini AI на основе данных ресторана
   */
  async generatePredictionWithGemini(
    requestDto: GeneratePredictionDto,
  ): Promise<BaseResponseDto<PredictionDto>> {
    try {
      const predictionDateTime = new Date(requestDto.dateTime);
      const predictionType = requestDto.predictionType || PredictionType.REVENUE;
      const period = requestDto.period || PredictionPeriod.HOURLY;

      // Получаем погодные данные
      const weatherData = await this.weatherService.getWeatherData(
        requestDto.coordinates.lat,
        requestDto.coordinates.lng,
        predictionDateTime,
      );

      // Используем Gemini AI для анализа популярности блюд
      const geminiResponse = await this.geminiService.predictFoodPopularityAndSales({
        hour: predictionDateTime.getHours(),
        dayOfWeek: predictionDateTime.getDay(),
        isWeekend: predictionDateTime.getDay() === 0 || predictionDateTime.getDay() === 6,
        isHoliday: false, // TODO: implement holiday detection
        seasonMultiplier: this.getSeasonMultiplier(predictionDateTime.getMonth()),
        weather: weatherData,
        city: requestDto.address.split(',').pop()?.trim() || 'Алматы',
      });

      console.log('Gemini AI food popularity analysis:', geminiResponse);

      // Вычисляем прогноз
      const calculationResult = await this.calculatePrediction(
        predictionType,
        predictionDateTime,
        requestDto.coordinates.lat,
        requestDto.coordinates.lng,
      );

      const predictionDto: PredictionDto = {
        id: uuid(),
        restaurant: {
          name: requestDto.name,
          address: requestDto.address,
          coordinates: {
            lat: requestDto.coordinates.lat,
            lng: requestDto.coordinates.lng,
          },
          dateTime: predictionDateTime,
        },
        predictionDateTime,
        predictionType,
        period,
        predictedValue: calculationResult.predictedValue,
        unit: this.getUnit(predictionType),
        confidenceLevel: calculationResult.confidenceLevel,
        confidenceScore: calculationResult.confidenceScore,
        factors: calculationResult.factors,
        baseValue: calculationResult.baseValue,
        description: calculationResult.description,
        foodPopularity: geminiResponse.foodPopularity,
        salesGrowth: geminiResponse.salesGrowth,
        createDate: new Date(),
        updateDate: new Date(),
      };

      return BaseResponseDto.success(predictionDto, 'Прогноз успешно создан с помощью Gemini AI');
    } catch (error) {
      console.error('Error generating prediction with Gemini:', error);
      throw new BadRequestException('Ошибка при создании прогноза с помощью Gemini AI');
    }
  }

  private getSeason(month: number): string {
    if (month >= 2 && month <= 4) return 'весна';
    if (month >= 5 && month <= 7) return 'лето';
    if (month >= 8 && month <= 10) return 'осень';
    return 'зима';
  }

  private getSeasonMultiplier(month: number): number {
    if (month >= 2 && month <= 4) return 1.1; // весна
    if (month >= 5 && month <= 7) return 1.3; // лето
    if (month >= 8 && month <= 10) return 1.2; // осень
    return 0.9; // зима
  }

  private getDefaultFoodPopularity(): FoodPopularityDto[] {
    return [
      {
        category: FoodCategory.HOT_DISHES,
        dishes: ['Плов', 'Бешбармак', 'Манты'],
        trend: PopularityTrend.RISING,
        confidence: 75,
      },
      {
        category: FoodCategory.SOUPS,
        dishes: ['Шурпа', 'Лагман', 'Наурыз көже'],
        trend: PopularityTrend.STABLE,
        confidence: 80,
      },
    ];
  }
}
