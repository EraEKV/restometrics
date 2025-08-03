import { ApiProperty } from '@nestjs/swagger';

export enum FoodCategory {
  HOT_DISHES = 'HOT_DISHES',
  COLD_DISHES = 'COLD_DISHES',
  SOUPS = 'SOUPS',
  SALADS = 'SALADS',
  DESSERTS = 'DESSERTS',
  BEVERAGES = 'BEVERAGES',
  FAST_FOOD = 'FAST_FOOD',
  TRADITIONAL_KAZAKH = 'TRADITIONAL_KAZAKH',
  MEAT_DISHES = 'MEAT_DISHES',
  VEGETARIAN = 'VEGETARIAN',
}

export enum PopularityTrend {
  RISING = 'RISING',
  STABLE = 'STABLE',
  DECLINING = 'DECLINING',
}

export class FoodPopularityDto {
  @ApiProperty({
    description: 'Категория блюд',
    enum: FoodCategory,
    example: FoodCategory.HOT_DISHES,
  })
  category: FoodCategory;

  @ApiProperty({
    description: 'Список популярных блюд в категории',
    example: ['Плов', 'Манты', 'Бешбармак'],
    type: [String],
  })
  dishes: string[];

  @ApiProperty({
    description: 'Тренд популярности',
    enum: PopularityTrend,
    example: PopularityTrend.RISING,
  })
  trend: PopularityTrend;

  @ApiProperty({
    description: 'Уровень уверенности в прогнозе (0-100)',
    example: 85,
    minimum: 0,
    maximum: 100,
  })
  confidence: number;
}

export class SalesGrowthDto {
  @ApiProperty({
    description: 'Прогнозируемый процент роста продаж',
    example: 15,
  })
  percentage: number;

  @ApiProperty({
    description: 'Основные факторы роста',
    example: [
      'Холодная погода привлекает к горячим блюдам',
      'Выходной день увеличивает посещаемость',
    ],
    type: [String],
  })
  factors: string[];

  @ApiProperty({
    description: 'Описание прогноза',
    example: 'Ожидается умеренный рост продаж благодаря благоприятным погодным условиям',
  })
  description: string;
}
