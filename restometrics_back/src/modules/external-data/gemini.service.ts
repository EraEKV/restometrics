import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import {
  FoodPopularityDto,
  SalesGrowthDto,
  FoodCategory,
  PopularityTrend,
} from '../predictions/dto/food-popularity.dto';
import { WeatherDto } from './dto/weather.dto';

export interface FoodPredictionInput {
  hour: number;
  dayOfWeek: number;
  isWeekend: boolean;
  isHoliday: boolean;
  seasonMultiplier: number;
  weather?: WeatherDto;
  city: string;
}

interface GeminiParsedResponse {
  foodPopularity: Array<{
    category: string;
    dishes: string[];
    trend: string;
    confidence: number;
  }>;
  salesGrowth: {
    percentage: number;
    factors: string[];
    description: string;
  };
}

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      this.logger.warn(
        'GEMINI_API_KEY не найден в переменных окружения. Будет использоваться резервная логика.',
      );
    } else {
      try {
        this.genAI = new GoogleGenerativeAI(apiKey);
        if (this.genAI) {
          this.model = this.genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
          });
        }
      } catch (error) {
        this.logger.error('Ошибка инициализации Gemini AI:', error);
      }
    }
  }

  async predictFoodPopularityAndSales(input: FoodPredictionInput): Promise<{
    foodPopularity: FoodPopularityDto[];
    salesGrowth: SalesGrowthDto;
  }> {
    if (this.model) {
      try {
        return await this.getGeminiPredictions(input);
      } catch (error) {
        this.logger.error('Ошибка Gemini AI, переключение на fallback:', error);
        return this.getFallbackPredictions(input);
      }
    } else {
      return this.getFallbackPredictions(input);
    }
  }

  private async getGeminiPredictions(input: FoodPredictionInput): Promise<{
    foodPopularity: FoodPopularityDto[];
    salesGrowth: SalesGrowthDto;
  }> {
    if (!this.model) {
      throw new Error('Gemini модель не инициализирована');
    }

    const prompt = this.buildGeminiPrompt(input);

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      return this.parseGeminiResponse(text);
    } catch (error) {
      this.logger.error('Ошибка при парсинге ответа Gemini:', error);
      throw error;
    }
  }

  private buildGeminiPrompt(input: FoodPredictionInput): string {
    const timeOfDay = input.hour < 12 ? 'утро' : input.hour < 17 ? 'день' : 'вечер';
    const dayType = input.isHoliday
      ? 'праздничный день'
      : input.isWeekend
        ? 'выходной'
        : 'рабочий день';
    const weatherInfo = input.weather
      ? `температура ${input.weather.temperature}°C, ${input.weather.description}`
      : 'погода неизвестна';

    return `
Ты аналитик ресторанной индустрии в Казахстане. Проанализируй данные и предоставь прогноз:

ВХОДНЫЕ ДАННЫЕ:
- Время: ${input.hour}:00 (${timeOfDay})
- День: ${dayType}
- Город: ${input.city}
- Погода: ${weatherInfo}
- Сезонный множитель: ${input.seasonMultiplier}

ЗАДАЧА: Предоставь JSON ответ с прогнозом популярности блюд и роста продаж для казахстанского ресторана.

ФОРМАТ ОТВЕТА (строго JSON):
{
  "foodPopularity": [
    {
      "category": "HOT_DISHES|SOUPS|COLD_DISHES|MEAT_DISHES|BEVERAGES|DESSERTS|TRADITIONAL_KAZAKH|FAST_FOOD|APPETIZERS|SALADS",
      "dishes": ["блюдо1", "блюдо2", "блюдо3"],
      "trend": "RISING|STABLE|DECLINING",
      "confidence": число_от_60_до_95
    }
  ],
  "salesGrowth": {
    "percentage": число_от_минус_20_до_плюс_80,
    "factors": ["фактор1", "фактор2"],
    "description": "краткое_описание_прогноза"
  }
}

ТРЕБОВАНИЯ:
1. Учитывай казахстанские предпочтения (плов, бешбармак, манты, лагман, шурпа)
2. Учитывай время суток (завтрак/обед/ужин)
3. Учитывай погоду и сезон
4. Верни только JSON, без дополнительного текста
5. Максимум 4-5 категорий блюд
`;
  }

  private parseGeminiResponse(text: string): {
    foodPopularity: FoodPopularityDto[];
    salesGrowth: SalesGrowthDto;
  } {
    try {
      const cleanText = text.replace(/```json\n?|```\n?/g, '').trim();
      const parsed = JSON.parse(cleanText) as GeminiParsedResponse;

      const foodPopularity: FoodPopularityDto[] = (parsed.foodPopularity || []).map((item) => {
        const dto = new FoodPopularityDto();
        dto.category = item.category as FoodCategory;
        dto.dishes = Array.isArray(item.dishes) ? item.dishes : [];
        dto.trend = item.trend as PopularityTrend;
        dto.confidence = typeof item.confidence === 'number' ? item.confidence : 75;
        return dto;
      });

      const salesGrowth = new SalesGrowthDto();
      salesGrowth.percentage =
        typeof parsed.salesGrowth?.percentage === 'number' ? parsed.salesGrowth.percentage : 0;
      salesGrowth.factors = Array.isArray(parsed.salesGrowth?.factors)
        ? parsed.salesGrowth.factors
        : [];
      salesGrowth.description =
        typeof parsed.salesGrowth?.description === 'string'
          ? parsed.salesGrowth.description
          : 'Описание недоступно';

      return { foodPopularity, salesGrowth };
    } catch (error) {
      this.logger.error('Ошибка парсинга ответа Gemini, используем fallback:', error);
      throw error;
    }
  }

  private getFallbackPredictions(input: FoodPredictionInput): {
    foodPopularity: FoodPopularityDto[];
    salesGrowth: SalesGrowthDto;
  } {
    const foodPopularity = this.generateFallbackFoodPopularity(input);
    const salesGrowth = this.generateFallbackSalesGrowth(input);

    return { foodPopularity, salesGrowth };
  }

  private generateFallbackFoodPopularity(input: FoodPredictionInput): FoodPopularityDto[] {
    const predictions: FoodPopularityDto[] = [];

    if (input.hour >= 7 && input.hour <= 11) {
      // Завтрак
      const beverages = new FoodPopularityDto();
      beverages.category = FoodCategory.BEVERAGES;
      beverages.dishes = ['Чай', 'Кофе', 'Айран'];
      beverages.trend = PopularityTrend.RISING;
      beverages.confidence = 85;
      predictions.push(beverages);

      const fastFood = new FoodPopularityDto();
      fastFood.category = FoodCategory.FAST_FOOD;
      fastFood.dishes = ['Самса', 'Бауырсак', 'Омлет'];
      fastFood.trend = PopularityTrend.RISING;
      fastFood.confidence = 80;
      predictions.push(fastFood);
    } else if (input.hour >= 12 && input.hour <= 15) {
      // Обед
      const hotDishes = new FoodPopularityDto();
      hotDishes.category = FoodCategory.HOT_DISHES;
      hotDishes.dishes = ['Плов', 'Бешбармак', 'Манты'];
      hotDishes.trend = PopularityTrend.RISING;
      hotDishes.confidence = 90;
      predictions.push(hotDishes);

      const soups = new FoodPopularityDto();
      soups.category = FoodCategory.SOUPS;
      soups.dishes = ['Шурпа', 'Лагман', 'Борщ'];
      soups.trend = PopularityTrend.RISING;
      soups.confidence = 85;
      predictions.push(soups);
    } else if (input.hour >= 18 && input.hour <= 22) {
      // Ужин
      const meatDishes = new FoodPopularityDto();
      meatDishes.category = FoodCategory.MEAT_DISHES;
      meatDishes.dishes = ['Казы', 'Шашлык', 'Куырдак'];
      meatDishes.trend = PopularityTrend.RISING;
      meatDishes.confidence = 85;
      predictions.push(meatDishes);
    }

    // Логика на основе погоды
    if (input.weather && input.weather.temperature < 5) {
      const hotDishes = new FoodPopularityDto();
      hotDishes.category = FoodCategory.HOT_DISHES;
      hotDishes.dishes = ['Горячие блюда', 'Супы'];
      hotDishes.trend = PopularityTrend.RISING;
      hotDishes.confidence = 80;
      predictions.push(hotDishes);
    } else if (input.weather && input.weather.temperature > 25) {
      const coldDishes = new FoodPopularityDto();
      coldDishes.category = FoodCategory.COLD_DISHES;
      coldDishes.dishes = ['Салаты', 'Холодные закуски'];
      coldDishes.trend = PopularityTrend.RISING;
      coldDishes.confidence = 75;
      predictions.push(coldDishes);
    }

    if (input.isWeekend) {
      const traditional = new FoodPopularityDto();
      traditional.category = FoodCategory.TRADITIONAL_KAZAKH;
      traditional.dishes = ['Бешбармак', 'Плов', 'Казы'];
      traditional.trend = PopularityTrend.RISING;
      traditional.confidence = 80;
      predictions.push(traditional);
    }

    return predictions.slice(0, 6);
  }

  private generateFallbackSalesGrowth(input: FoodPredictionInput): SalesGrowthDto {
    let baseGrowth = 0;
    const factors: string[] = [];

    if (input.hour >= 12 && input.hour <= 14) {
      baseGrowth += 20;
      factors.push('Обеденное время - пик посещаемости');
    } else if (input.hour >= 19 && input.hour <= 21) {
      baseGrowth += 15;
      factors.push('Ужин - высокая активность');
    }

    if (input.isWeekend) {
      baseGrowth += 25;
      factors.push('Выходной день увеличивает посещаемость');
    }

    if (input.isHoliday) {
      baseGrowth += 30;
      factors.push('Праздничный день');
    }

    if (input.weather) {
      if (input.weather.temperature < 0) {
        baseGrowth += 10;
        factors.push('Холодная погода привлекает к горячим блюдам');
      } else if (input.weather.temperature > 30) {
        baseGrowth += 5;
        factors.push('Жаркая погода увеличивает спрос на прохладительные напитки');
      }
    }

    baseGrowth *= input.seasonMultiplier;

    const salesGrowth = new SalesGrowthDto();
    salesGrowth.percentage = Math.round(baseGrowth);
    salesGrowth.factors = factors.length > 0 ? factors : ['Стандартные рыночные факторы'];
    salesGrowth.description = this.generateSalesDescription(salesGrowth.percentage);

    return salesGrowth;
  }

  private generateSalesDescription(percentage: number): string {
    if (percentage >= 30) {
      return 'Ожидается значительный рост продаж благодаря благоприятным факторам';
    } else if (percentage >= 15) {
      return 'Прогнозируется умеренный рост продаж';
    } else if (percentage >= 5) {
      return 'Ожидается небольшой рост продаж';
    } else if (percentage <= -10) {
      return 'Возможно снижение продаж из-за неблагоприятных условий';
    } else {
      return 'Продажи останутся на стабильном уровне';
    }
  }
}
