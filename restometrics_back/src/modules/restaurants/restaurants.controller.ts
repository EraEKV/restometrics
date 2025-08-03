import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Patch,
  HttpStatus,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Request } from 'express';
import { RestaurantsService } from './restaurants.service';
import {
  CreateRestaurantDto,
  UpdateRestaurantDto,
  RestaurantDto,
  SearchRestaurantsDto,
  RestaurantStatus,
} from './dto';
import { BaseResponseDto, PaginatedResponseDto } from '../../shared/base';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый ресторан' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Ресторан успешно создан со статусом "approved"',
    type: BaseResponseDto<RestaurantDto>,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Некорректные данные',
  })
  create(
    @Body() createRestaurantDto: CreateRestaurantDto,
  ): Promise<BaseResponseDto<RestaurantDto>> {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить текущий ресторан пользователя' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ресторан получен успешно',
    type: BaseResponseDto<RestaurantDto>,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Пользователь не авторизован',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ресторан не найден',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Номер страницы' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество записей на странице',
  })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Поисковый запрос' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Фильтр по названию' })
  @ApiQuery({ name: 'address', required: false, type: String, description: 'Фильтр по адресу' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: RestaurantStatus,
    description: 'Фильтр по статусу',
  })
  @ApiQuery({
    name: 'hasMenu',
    required: false,
    type: Boolean,
    description: 'Фильтр по наличию меню',
  })
  @ApiQuery({
    name: 'ownerName',
    required: false,
    type: String,
    description: 'Фильтр по имени владельца',
  })
  @ApiQuery({
    name: 'ownerEmail',
    required: false,
    type: String,
    description: 'Фильтр по email владельца',
  })
  @ApiQuery({
    name: 'registrationId',
    required: false,
    type: String,
    description: 'Фильтр по ID регистрации',
  })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Поле для сортировки' })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Направление сортировки',
  })
  getCurrentRestaurant(
    @Req() req: Request & { restaurantId?: string },
  ): Promise<BaseResponseDto<RestaurantDto>> {
    if (!req.restaurantId) {
      throw new UnauthorizedException('Необходима авторизация');
    }
    return this.restaurantsService.getCurrentRestaurant(req.restaurantId);
  }

  @Put()
  @ApiOperation({ summary: 'Обновить данные текущего ресторана' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ресторан успешно обновлен',
    type: BaseResponseDto<RestaurantDto>,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Необходима авторизация',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Некорректные данные',
  })
  updateCurrentRestaurant(
    @Req() req: Request & { restaurantId?: string },
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<BaseResponseDto<RestaurantDto>> {
    if (!req.restaurantId) {
      throw new UnauthorizedException('Необходима авторизация');
    }
    return this.restaurantsService.update(req.restaurantId, updateRestaurantDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Поиск ресторанов с фильтрами' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список ресторанов успешно получен',
    type: PaginatedResponseDto<RestaurantDto>,
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Номер страницы' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество элементов на странице',
  })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Фильтр по названию' })
  @ApiQuery({ name: 'address', required: false, type: String, description: 'Фильтр по адресу' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: RestaurantStatus,
    description: 'Фильтр по статусу',
  })
  @ApiQuery({
    name: 'hasMenu',
    required: false,
    type: Boolean,
    description: 'Фильтр по наличию меню',
  })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Общий поиск' })
  @ApiQuery({
    name: 'ownerName',
    required: false,
    type: String,
    description: 'Фильтр по имени владельца',
  })
  @ApiQuery({
    name: 'ownerEmail',
    required: false,
    type: String,
    description: 'Фильтр по email владельца',
  })
  @ApiQuery({
    name: 'registrationId',
    required: false,
    type: String,
    description: 'Фильтр по ID регистрации',
  })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Поле для сортировки' })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Направление сортировки',
  })
  searchRestaurants(
    @Query() query: SearchRestaurantsDto,
  ): Promise<PaginatedResponseDto<RestaurantDto>> {
    return this.restaurantsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить ресторан по ID' })
  @ApiParam({ name: 'id', description: 'ID ресторана', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ресторан найден',
    type: BaseResponseDto<RestaurantDto>,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ресторан не найден',
  })
  findOne(@Param('id') id: string): Promise<BaseResponseDto<RestaurantDto>> {
    return this.restaurantsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить данные ресторана' })
  @ApiParam({ name: 'id', description: 'ID ресторана', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ресторан успешно обновлен',
    type: BaseResponseDto<RestaurantDto>,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ресторан не найден',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Некорректные данные',
  })
  update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<BaseResponseDto<RestaurantDto>> {
    return this.restaurantsService.update(id, updateRestaurantDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Обновить статус ресторана' })
  @ApiParam({ name: 'id', description: 'ID ресторана', format: 'uuid' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['pending', 'approved', 'rejected', 'suspended'],
          description: 'Новый статус ресторана',
          example: 'approved',
        },
      },
      required: ['status'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Статус ресторана успешно обновлен',
    type: BaseResponseDto<RestaurantDto>,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ресторан не найден',
  })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: RestaurantStatus,
  ): Promise<BaseResponseDto<RestaurantDto>> {
    return this.restaurantsService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить ресторан' })
  @ApiParam({ name: 'id', description: 'ID ресторана', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ресторан успешно удален',
    type: BaseResponseDto<void>,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ресторан не найден',
  })
  remove(@Param('id') id: string): Promise<BaseResponseDto<void>> {
    return this.restaurantsService.remove(id);
  }
}
