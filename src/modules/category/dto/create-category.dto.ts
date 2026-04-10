import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Tên danh mục',
    example: 'Điện thoại',
    required: true,
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  @IsString({ message: 'Tên danh mục phải là một chuỗi' })
  @MaxLength(100, { message: 'Tên danh mục không được vượt quá 100 ký tự' })
  name!: string;

  @ApiProperty({
    description: 'Mô tả danh mục',
    example: 'Danh mục điện thoại bao gồm các sản phẩm điện thoại di động',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Mô tả danh mục phải là một chuỗi' })
  @MaxLength(255, { message: 'Mô tả danh mục không được vượt quá 255 ký tự' })
  description?: string;

  @ApiProperty({
    description: 'Slug của danh mục',
    example: 'dien-thoai',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Slug của danh mục phải là một chuỗi' })
  @MaxLength(100, {
    message: 'Slug của danh mục không được vượt quá 100 ký tự',
  })
  slug?: string;

  @ApiProperty({
    description: 'URL hình ảnh của danh mục',
    example: 'https://example.com/images/category.jpg',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'URL hình ảnh của danh mục phải là một chuỗi' })
  @MaxLength(255, {
    message: 'URL hình ảnh của danh mục không được vượt quá 255 ký tự',
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Trạng thái hoạt động của danh mục',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean({
    message: 'Trạng thái hoạt động của danh mục phải là một giá trị boolean',
  })
  isActive?: boolean;

  @ApiProperty({
    description: 'Trạng thái xóa của danh mục',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({
    message: 'Trạng thái xóa của danh mục phải là một giá trị boolean',
  })
  isDelete?: boolean;
}
