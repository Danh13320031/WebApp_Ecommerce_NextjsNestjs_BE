import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class QueryProductDto {
  @ApiPropertyOptional({
    description: 'Bộ lọc theo danh mục sản phẩm',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString({ message: 'Danh mục phải là một chuỗi' })
  @IsUUID(4, { message: 'Danh mục phải là một UUID phiên bản 4' })
  category?: string;

  @ApiProperty({
    description: 'Trạng thái hoạt động của sản phẩm',
    example: true,
  })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;

    return undefined;
  })
  @IsBoolean({
    message: 'Trạng thái hoạt động của sản phẩm phải là một giá trị boolean',
  })
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'Từ khóa tìm kiếm sản phẩm',
    example: 'Tai nghe Bluetooth Sony WH-1000XM4',
  })
  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm sản phẩm phải là một chuỗi' })
  search?: string;

  @ApiProperty({
    description: 'Số trang để phân trang',
    example: 1,
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
