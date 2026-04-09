import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Địa chỉ email',
    example: 'Z0YlM@example.com',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Địa chỉ email phải là một chuỗi' })
  @IsEmail({}, { message: 'Địa chỉ email không hợp lệ' })
  email?: string;

  @ApiProperty({
    description: 'Họ',
    example: 'Nguyễn',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Họ phải là một chuỗi' })
  firstName?: string;

  @ApiProperty({
    description: 'Tên',
    example: 'Dương',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Tên phải là một chuỗi' })
  lastName?: string;

  @ApiProperty({
    description: 'Avatar',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Avatar phải là một chuỗi' })
  avatar?: string;
}
