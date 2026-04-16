import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EOrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class QueryOrderDto {
  @ApiProperty({
    description: 'Trạng thái hoạt động của đơn hàng',
    example: EOrderStatus.PENDING,
    required: false,
  })
  @IsOptional()
  @IsEnum(EOrderStatus, {
    message: 'Trạng thái hoạt động của đơn hàng không hợp lệ',
  })
  status?: EOrderStatus;

  @ApiProperty({
    description: 'Từ khóa tìm kiếm đơn hàng',
    example: 'Điện thoại',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm đơn hàng phải là một chuỗi' })
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
