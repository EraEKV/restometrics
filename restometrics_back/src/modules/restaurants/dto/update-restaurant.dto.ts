import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsNumber,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RestaurantOwnerDto } from './restaurant-owner.dto';

export class UpdateRestaurantDto {
  @ApiProperty({
    description: 'Название ресторана',
    example: 'Золотой кувшин, кафе',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Адрес ресторана',
    example: 'улица Акан Серы, 81',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Координаты ресторана [longitude, latitude]',
    example: [76.9851392, 43.3061888],
    type: [Number],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  coordinates?: [number, number];

  @ApiProperty({
    description: 'Есть ли меню у ресторана',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasMenu?: boolean;

  @ApiProperty({
    description: 'Пользовательское название ресторана',
    example: 'Мой любимый ресторан',
    required: false,
  })
  @IsOptional()
  @IsString()
  customName?: string;

  @ApiProperty({
    description: 'Информация о владельце ресторана',
    type: RestaurantOwnerDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RestaurantOwnerDto)
  owner?: RestaurantOwnerDto;

  @ApiProperty({
    description: 'ID на карте',
    example: 'map_12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  mapId?: string;
}
