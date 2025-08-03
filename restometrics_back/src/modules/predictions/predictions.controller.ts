import { Controller, Post, Get, Body, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PredictionsService } from './predictions.service';
import { GeneratePredictionDto } from './dto/generate-prediction.dto';
import { PredictionRequestDto } from './dto/prediction-request.dto';
import { PredictionDto, PredictionType, PredictionPeriod } from './dto/prediction.dto';
import { BaseResponseDto } from '../../shared/base';

interface PredictionQueryParams {
  restaurantId?: string;
  predictionDateTime?: string;
  predictionType?: PredictionType;
  period?: PredictionPeriod;
}

interface AuthenticatedRequest {
  user?: {
    restaurantId?: string;
    [key: string]: unknown;
  };
}

@ApiTags('Прогнозы')
@Controller('predictions')
export class PredictionsController {
  constructor(private readonly predictionsService: PredictionsService) {}

  @Post('generate')
  @ApiOperation({
    summary: 'Создать прогноз (POST)',
    description:
      'Генерирует комплексный прогноз на основе временных факторов, погодных условий и AI-анализа популярности блюд. ' +
      'Включает прогноз выручки/заказов/трафика, популярности блюд по категориям и факторы роста продаж.',
  })
  @ApiResponse({
    status: 201,
    description: 'Прогноз успешно создан с данными о популярности блюд и росте продаж',
    type: PredictionDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные запроса',
  })
  @ApiResponse({
    status: 404,
    description: 'Ресторан не найден',
  })
  async generatePrediction(
    @Body() requestDto: GeneratePredictionDto,
  ): Promise<BaseResponseDto<PredictionDto>> {
    return this.predictionsService.generatePredictionWithGemini(requestDto);
  }

  // @Get('generate')
  // @ApiOperation({
  //   summary: 'Создать прогноз (GET)',
  //   description:
  //     'Генерирует комплексный прогноз на основе временных факторов, погодных условий и AI-анализа популярности блюд. ' +
  //     'Использует параметры запроса для настройки прогноза.',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Прогноз успешно создан с данными о популярности блюд и росте продаж',
  //   type: PredictionDto,
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Некорректные параметры запроса',
  // })
  // generatePredictionGet(@Query() query: PredictionQueryParams): BaseResponseDto<PredictionDto> {
  //   const requestDto: PredictionRequestDto = {
  //     restaurantId: query.restaurantId,
  //     predictionDateTime: query.predictionDateTime ? new Date(query.predictionDateTime) : undefined,
  //     predictionType: query.predictionType,
  //     period: query.period,
  //   };

  //   return this.predictionsService.generatePrediction(requestDto);
  // }

  // @Post()
  // @ApiOperation({
  //   summary: 'Получить прогноз для текущего ресторана (POST)',
  //   description:
  //     'Генерирует комплексный прогноз для ресторана из сессии пользователя с AI-анализом популярности блюд и факторов роста продаж. ' +
  //     'Автоматически определяет ресторан по авторизации.',
  // })
  // @ApiResponse({
  //   status: 201,
  //   description: 'Прогноз успешно создан с данными о популярности блюд и росте продаж',
  //   type: PredictionDto,
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Некорректные данные запроса',
  // })
  // @ApiResponse({
  //   status: 401,
  //   description: 'Не авторизован или сессия истекла',
  // })
  // getCurrentRestaurantPrediction(
  //   @Body() requestDto: PredictionRequestDto,
  //   @Request() req: AuthenticatedRequest,
  // ): BaseResponseDto<PredictionDto> {
  //   const restaurantId: string =
  //     (req.user?.restaurantId as string) || requestDto.restaurantId || 'demo-restaurant-id';

  //   return this.predictionsService.getCurrentRestaurantPrediction(restaurantId, requestDto);
  // }

  // @Get()
  // @ApiOperation({
  //   summary: 'Получить прогноз для текущего ресторана (GET)',
  //   description:
  //     'Генерирует комплексный прогноз для ресторана из сессии пользователя с AI-анализом популярности блюд и факторов роста продаж.',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Прогноз успешно создан с данными о популярности блюд и росте продаж',
  //   type: PredictionDto,
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Некорректные параметры запроса',
  // })
  // @ApiResponse({
  //   status: 401,
  //   description: 'Не авторизован или сессия истекла',
  // })
  // getCurrentRestaurantPredictionGet(
  //   @Query() query: PredictionQueryParams,
  //   @Request() req: AuthenticatedRequest,
  // ): BaseResponseDto<PredictionDto> {
  //   const requestDto: PredictionRequestDto = {
  //     restaurantId: query.restaurantId,
  //     predictionDateTime: query.predictionDateTime ? new Date(query.predictionDateTime) : undefined,
  //     predictionType: query.predictionType,
  //     period: query.period,
  //   };

  //   const restaurantId: string =
  //     (req.user?.restaurantId as string) || requestDto.restaurantId || 'demo-restaurant-id';

  //   return this.predictionsService.getCurrentRestaurantPrediction(restaurantId, requestDto);
  // }
}
