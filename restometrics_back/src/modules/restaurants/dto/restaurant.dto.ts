import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BaseEntityDto } from '../../../shared/base';
import { RestaurantOwnerDto } from './restaurant-owner.dto';
import { RestaurantStatus } from '../../../core/database/database.types';

export class RestaurantDto extends BaseEntityDto {
  @ApiProperty({
    description: 'Название ресторана',
    example: 'Золотой кувшин, кафе',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Адрес ресторана',
    example: 'улица Акан Серы, 81',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Координаты ресторана [longitude, latitude]',
    example: [76.9851392, 43.3061888],
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  coordinates: [number, number];

  @ApiProperty({
    description: 'Есть ли меню у ресторана',
    example: true,
  })
  @IsBoolean()
  hasMenu: boolean;

  @ApiProperty({
    description: 'ID регистрации ресторана',
    example: 'rest_1754165064110',
  })
  @IsString()
  registrationId: string;

  @ApiProperty({
    description: 'Пользовательское название ресторана',
    example: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  customName?: string;

  @ApiProperty({
    description: 'Информация о владельце ресторана',
    type: RestaurantOwnerDto,
  })
  @ValidateNested()
  @Type(() => RestaurantOwnerDto)
  owner: RestaurantOwnerDto;

  @ApiProperty({
    description: 'Статус ресторана',
    example: 'approved',
    enum: RestaurantStatus,
  })
  @IsEnum(RestaurantStatus)
  status: RestaurantStatus;

  @ApiProperty({
    description: 'ID на карте',
    example: 'map_12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  mapId?: string;
}
