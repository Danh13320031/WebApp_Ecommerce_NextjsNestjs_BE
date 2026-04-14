import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class QueryCategoryDto {
  @ApiProperty({
    description: 'Trạng thái hoạt động của danh mục',
    example: true,
    required: false,
  })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;

    return undefined;
  })
  @IsBoolean({
    message: 'Trạng thái hoạt động của danh mục phải là một giá trị boolean',
  })
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'Từ khóa tìm kiếm danh mục',
    example: 'Điện thoại',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm danh mục phải là một chuỗi' })
  search?: string;

  @ApiProperty({
    description: 'Số trang để phân trang',
    example: 1,
    required: false,
    default: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Số trang phải là một số' })
  @Min(1, { message: 'Số trang phải lớn hơn hoặc bằng 1' })
  @IsOptional()
  page = 1;

  @ApiPropertyOptional({
    description: 'Số lượng bản ghi trên mỗi trang',
    example: 10,
    required: false,
    default: 10,
    minimum: 1,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Số lượng bản ghi trên mỗi trang phải là một số' })
  @Min(1, {
    message: 'Số lượng bản ghi trên mỗi trang phải lớn hơn hoặc bằng 1',
  })
  @IsOptional()
  limit = 10;
}
