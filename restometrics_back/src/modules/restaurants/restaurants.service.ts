import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { DatabaseService } from '../../core/database';
import {
  CreateRestaurantDto,
  UpdateRestaurantDto,
  RestaurantDto,
  SearchRestaurantsDto,
} from './dto';
import { BaseResponseDto, PaginatedResponseDto } from '../../shared/base';
import { RestaurantStatus } from '../../core/database/database.types';
import type { Restaurant, NewRestaurant } from '../../core/database/database.types';

@Injectable()
export class RestaurantsService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Маппинг из базы данных в DTO
   */
  private mapToDto(restaurant: Restaurant): RestaurantDto {
    const owner = JSON.parse(restaurant.owner) as {
      name: string;
      phone: string;
      email: string;
    };

    // Парсим POINT из строки "POINT(lng lat)" в массив [lng, lat]
    const pointMatch = restaurant.coordinates.match(/POINT\(([^ ]+) ([^ ]+)\)/);
    const coordinates: [number, number] = pointMatch
      ? [parseFloat(pointMatch[1]), parseFloat(pointMatch[2])]
      : [0, 0];

    return {
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      coordinates,
      hasMenu: restaurant.has_menu,
      registrationId: restaurant.registration_id,
      customName: restaurant.custom_name || undefined,
      owner,
      status: restaurant.status,
      mapId: restaurant.map_id || undefined,
      represent: restaurant.represent || undefined,
      createDate: restaurant.create_date,
      updateDate: restaurant.update_date,
    };
  }

  async create(createRestaurantDto: CreateRestaurantDto): Promise<BaseResponseDto<RestaurantDto>> {
    try {
      const newRestaurant: NewRestaurant = {
        id: uuid(),
        name: createRestaurantDto.name,
        address: createRestaurantDto.address,
        coordinates: `POINT(${createRestaurantDto.coordinates[0]} ${createRestaurantDto.coordinates[1]})`,
        has_menu: createRestaurantDto.hasMenu || false,
        registration_id: createRestaurantDto.registrationId,
        custom_name: createRestaurantDto.customName || null,
        owner: JSON.stringify(createRestaurantDto.owner),
        status: RestaurantStatus.PENDING,
        map_id: createRestaurantDto.mapId || null,
        represent: createRestaurantDto.customName || createRestaurantDto.name,
      };

      const restaurant = await this.databaseService.db
        .insertInto('restaurants')
        .values(newRestaurant)
        .returningAll()
        .executeTakeFirstOrThrow();

      return BaseResponseDto.success(this.mapToDto(restaurant), 'Ресторан успешно создан');
    } catch (error) {
      console.error('Error creating restaurant:', error);
      throw new BadRequestException('Ошибка при создании ресторана');
    }
  }

  /**
   * Получить ресторан по registration_id (для авторизации)
   */
  async findByRegistrationId(registrationId: string): Promise<RestaurantDto | null> {
    try {
      const restaurant = await this.databaseService.db
        .selectFrom('restaurants')
        .where('registration_id', '=', registrationId)
        .selectAll()
        .executeTakeFirst();

      if (!restaurant) return null;
      return this.mapToDto(restaurant);
    } catch (error) {
      console.error('Error finding restaurant by registration_id:', error);
      return null;
    }
  }

  /**
   * Создать ресторан по registration_id с базовыми данными (для авторизации)
   */
  async createFromRegistrationId(registrationId: string): Promise<BaseResponseDto<RestaurantDto>> {
    try {
      const newRestaurant: NewRestaurant = {
        id: uuid(),
        name: `Ресторан ${registrationId}`, // Базовое название
        address: 'Адрес не указан', // Базовый адрес
        coordinates: 'POINT(0 0)', // Базовые координаты
        has_menu: false,
        registration_id: registrationId,
        custom_name: null,
        owner: JSON.stringify({
          name: 'Не указано',
          phone: 'Не указано',
          email: 'Не указано',
        }),
        status: RestaurantStatus.PENDING,
        map_id: null,
        represent: `Ресторан ${registrationId}`,
      };

      const restaurant = await this.databaseService.db
        .insertInto('restaurants')
        .values(newRestaurant)
        .returningAll()
        .executeTakeFirstOrThrow();

      return BaseResponseDto.success(this.mapToDto(restaurant), 'Ресторан успешно создан');
    } catch (error) {
      console.error('Error creating restaurant from registration_id:', error);
      throw new BadRequestException('Ошибка при создании ресторана');
    }
  }

  /**
   * Получить текущий ресторан пользователя по restaurantId из сессии
   */
  async getCurrentRestaurant(restaurantId: string): Promise<BaseResponseDto<RestaurantDto>> {
    try {
      const restaurant = await this.databaseService.db
        .selectFrom('restaurants')
        .where('id', '=', restaurantId)
        .selectAll()
        .executeTakeFirst();

      if (!restaurant) {
        throw new NotFoundException('Ресторан не найден');
      }

      return BaseResponseDto.success(this.mapToDto(restaurant), 'Ресторан получен успешно');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error finding current restaurant:', error);
      throw new BadRequestException('Ошибка при получении ресторана');
    }
  }

  async findAll(searchDto: SearchRestaurantsDto): Promise<PaginatedResponseDto<RestaurantDto>> {
    try {
      let query = this.databaseService.db.selectFrom('restaurants');

      if (searchDto.name) {
        query = query.where('name', 'ilike', `%${searchDto.name}%`);
      }
      if (searchDto.address) {
        query = query.where('address', 'ilike', `%${searchDto.address}%`);
      }
      if (searchDto.status) {
        query = query.where('status', '=', searchDto.status);
      }
      if (searchDto.hasMenu !== undefined) {
        query = query.where('has_menu', '=', searchDto.hasMenu);
      }
      if (searchDto.registrationId) {
        query = query.where('registration_id', 'ilike', `%${searchDto.registrationId}%`);
      }

      if (searchDto.search) {
        query = query.where((eb) =>
          eb.or([
            eb('name', 'ilike', `%${searchDto.search}%`),
            eb('address', 'ilike', `%${searchDto.search}%`),
            eb('custom_name', 'ilike', `%${searchDto.search}%`),
            eb('represent', 'ilike', `%${searchDto.search}%`),
          ]),
        );
      }

      const totalResult = await query
        .clearSelect()
        .clearOrderBy()
        .select((eb) => eb.fn.count('id').as('count'))
        .executeTakeFirstOrThrow();

      const total = Number(totalResult.count);

      const restaurants = await query
        .orderBy('create_date', searchDto.sortOrder || 'desc')
        .limit(searchDto.limit || 10)
        .offset(((searchDto.page || 1) - 1) * (searchDto.limit || 10))
        .selectAll()
        .execute();

      const mappedRestaurants = restaurants.map((r) => this.mapToDto(r));

      return PaginatedResponseDto.paginated(
        mappedRestaurants,
        searchDto.page || 1,
        searchDto.limit || 10,
        total,
        'Рестораны получены успешно',
      );
    } catch (error) {
      console.error('Error finding restaurants:', error);
      throw new BadRequestException('Ошибка при получении списка ресторанов');
    }
  }

  async findOne(id: string): Promise<BaseResponseDto<RestaurantDto>> {
    try {
      const restaurant = await this.databaseService.db
        .selectFrom('restaurants')
        .where('id', '=', id)
        .selectAll()
        .executeTakeFirst();

      if (!restaurant) {
        throw new NotFoundException('Ресторан не найден');
      }

      return BaseResponseDto.success(this.mapToDto(restaurant), 'Ресторан получен успешно');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error finding restaurant:', error);
      throw new BadRequestException('Ошибка при получении ресторана');
    }
  }

  async updateStatus(
    id: string,
    status: RestaurantStatus,
  ): Promise<BaseResponseDto<RestaurantDto>> {
    try {
      const restaurant = await this.databaseService.db
        .updateTable('restaurants')
        .set({
          status: status,
          update_date: new Date(),
        })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst();

      if (!restaurant) {
        throw new NotFoundException('Ресторан не найден');
      }

      return BaseResponseDto.success(this.mapToDto(restaurant), 'Статус ресторана обновлен');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error updating restaurant status:', error);
      throw new BadRequestException('Ошибка при обновлении статуса ресторана');
    }
  }

  async update(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<BaseResponseDto<RestaurantDto>> {
    try {
      const existingRestaurant = await this.databaseService.db
        .selectFrom('restaurants')
        .where('id', '=', id)
        .selectAll()
        .executeTakeFirst();

      if (!existingRestaurant) {
        throw new NotFoundException('Ресторан не найден');
      }

      const updateData: Partial<Restaurant> = {
        update_date: new Date(),
      };

      if (updateRestaurantDto.name !== undefined) {
        updateData.name = updateRestaurantDto.name;
        if (!updateRestaurantDto.customName && !existingRestaurant.custom_name) {
          updateData.represent = updateRestaurantDto.name;
        }
      }
      if (updateRestaurantDto.address !== undefined) {
        updateData.address = updateRestaurantDto.address;
      }
      if (updateRestaurantDto.coordinates !== undefined) {
        updateData.coordinates = `POINT(${updateRestaurantDto.coordinates[0]} ${updateRestaurantDto.coordinates[1]})`;
      }
      if (updateRestaurantDto.hasMenu !== undefined) {
        updateData.has_menu = updateRestaurantDto.hasMenu;
      }
      if (updateRestaurantDto.customName !== undefined) {
        updateData.custom_name = updateRestaurantDto.customName;
        updateData.represent = updateRestaurantDto.customName || existingRestaurant.name;
      }
      if (updateRestaurantDto.owner !== undefined) {
        updateData.owner = JSON.stringify(updateRestaurantDto.owner);
      }
      if (updateRestaurantDto.mapId !== undefined) {
        updateData.map_id = updateRestaurantDto.mapId;
      }

      const updatedRestaurant = await this.databaseService.db
        .updateTable('restaurants')
        .set(updateData)
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow();

      return BaseResponseDto.success(this.mapToDto(updatedRestaurant), 'Ресторан успешно обновлен');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error updating restaurant:', error);
      throw new BadRequestException('Ошибка при обновлении ресторана');
    }
  }

  async remove(id: string): Promise<BaseResponseDto<void>> {
    try {
      const result = await this.databaseService.db
        .deleteFrom('restaurants')
        .where('id', '=', id)
        .executeTakeFirst();

      if (result.numDeletedRows === BigInt(0)) {
        throw new NotFoundException('Ресторан не найден');
      }

      return BaseResponseDto.success(undefined, 'Ресторан успешно удален');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error removing restaurant:', error);
      throw new BadRequestException('Ошибка при удалении ресторана');
    }
  }
}
