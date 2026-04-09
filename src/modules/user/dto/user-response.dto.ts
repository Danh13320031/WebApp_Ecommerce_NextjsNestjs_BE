import { ApiProperty } from '@nestjs/swagger';
import { ERole } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class UserResponseDto {
  @ApiProperty({
    description: 'Id người dùng',
    example: '1234567890',
    required: true,
  })
  @IsNotEmpty({ message: 'Id người dùng khóa' })
  @IsString({ message: 'Id người dùng phải là một chuỗi' })
  @IsUUID(4, { message: 'Id người dùng khóng hợp lệ' })
  id!: string;

  @ApiProperty({
    description: 'Địa chỉ email',
    example: 'Z0YlM@example.com',
    required: true,
  })
  @IsNotEmpty({ message: 'Địa chỉ email không được để trống' })
  @IsString({ message: 'Địa chỉ email phải là một chuỗi' })
  @IsEmail({}, { message: 'Địa chỉ email không hợp lệ' })
  email!: string;

  @ApiProperty({
    description: 'Tên',
    example: 'Dương',
    nullable: true,
  })
  firstName!: string | null;

  @ApiProperty({
    description: 'Họ',
    example: 'Nguyễn',
    nullable: true,
  })
  lastName!: string | null;

  @ApiProperty({
    description: 'Avatar người dùng',
    example: 'https://example.com/avatar.jpg',
    nullable: true,
  })
  avatar!: string | null;

  @ApiProperty({
    description: 'Vai trò người dùng',
    example: ERole.USER,
    required: true,
  })
  @IsNotEmpty({ message: 'Vai troì người dùng không được để trống' })
  @IsArray({ message: 'Vai troì người dùng phải là một mảng' })
  role!: ERole;

  @ApiProperty({
    description: 'Trang thái người dùng',
    example: true,
    required: true,
  })
  @IsNotEmpty({ message: 'Trạng thái người dùng không được để trống' })
  @IsBoolean({ message: 'Trạng thái người dùng phải là true hoặc false' })
  isActive!: boolean;

  @ApiProperty({
    description: 'Trang thái xóa mềm người dùng',
    example: true,
    required: true,
  })
  @IsNotEmpty({
    message: 'Trạng thái xóa mềm người dùng không được để trống',
  })
  @IsBoolean({
    message: 'Trạng thái xóa mềm người dùng phải là true hoặc false',
  })
  isDelete!: boolean;

  @ApiProperty({
    description: 'Ngày tạo người dùng',
    example: '2022-01-01T00:00:00.000Z',
  })
  @IsNotEmpty({ message: 'Ngày tạo người dùng không được để trống' })
  @IsDate({ message: 'Ngày tạo người dùng phải là ngày' })
  createdAt!: Date;

  @ApiProperty({
    description: 'Ngày cập nhật người dùng',
    example: '2022-01-01T00:00:00.000Z',
  })
  @IsNotEmpty({ message: 'Ngày cập nhật người dùng không được để trống' })
  @IsDate({ message: 'Ngày cập nhật người dùng phải là ngày' })
  updatedAt!: Date;
}
