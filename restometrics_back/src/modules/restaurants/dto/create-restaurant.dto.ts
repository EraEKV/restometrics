import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BaseCreateDto } from '../../../shared/base';
import { RestaurantOwnerDto } from './restaurant-owner.dto';

export class CreateRestaurantDto extends BaseCreateDto {
  @ApiProperty({
    description: 'Название ресторана',
    example: 'Золотой кувшин, кафе',
  })
  @IsString({ message: 'Название должно быть строкой' })
  @IsNotEmpty({ message: 'Название не может быть пустым' })
  name: string;

  @ApiProperty({
    description: 'Адрес ресторана',
    example: 'улица Акан Серы, 81',
  })
  @IsString({ message: 'Адрес должен быть строкой' })
  @IsNotEmpty({ message: 'Адрес не может быть пустым' })
  address: string;

  @ApiProperty({
    description: 'Координаты ресторана [longitude, latitude]',
    example: [76.9851392, 43.3061888],
    type: [Number],
  })
  @IsArray({ message: 'Координаты должны быть массивом' })
  @IsNumber({}, { each: true, message: 'Каждая координата должна быть числом' })
  coordinates: [number, number];

  @ApiProperty({
    description: 'Есть ли меню у ресторана',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'hasMenu должно быть булевым значением' })
  hasMenu?: boolean = false;

  @ApiProperty({
    description: 'ID регистрации ресторана',
    example: 'rest_1754165064110',
  })
  @IsString({ message: 'ID регистрации должен быть строкой' })
  @IsNotEmpty({ message: 'ID регистрации не может быть пустым' })
  registrationId: string;

  @ApiProperty({
    description: 'Пользовательское название ресторана',
    example: '',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Пользовательское название должно быть строкой' })
  customName?: string;

  @ApiProperty({
    description: 'Информация о владельце ресторана',
    type: RestaurantOwnerDto,
  })
  @ValidateNested()
  @Type(() => RestaurantOwnerDto)
  owner: RestaurantOwnerDto;

  @ApiProperty({
    description: 'ID на карте',
    example: 'map_12345',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'ID карты должен быть строкой' })
  mapId?: string;
}
