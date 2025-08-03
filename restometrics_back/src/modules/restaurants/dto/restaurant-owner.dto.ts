import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class RestaurantOwnerDto {
  @ApiProperty({
    description: 'Имя владельца ресторана',
    example: 'Test',
  })
  @IsString({ message: 'Имя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  name: string;

  @ApiProperty({
    description: 'Телефон владельца',
    example: '+77777777777',
  })
  @IsString({ message: 'Телефон должен быть строкой' })
  @IsNotEmpty({ message: 'Телефон не может быть пустым' })
  phone: string;

  @ApiProperty({
    description: 'Email владельца',
    example: 'example@gmail.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string;
}
