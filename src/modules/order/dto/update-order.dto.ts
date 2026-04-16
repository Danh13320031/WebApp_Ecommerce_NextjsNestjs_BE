import { ApiProperty } from '@nestjs/swagger';
import { EOrderStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'Trạng thái đơn hàng',
    example: EOrderStatus.PENDING,
    required: false,
  })
  @IsOptional()
  @IsEnum(EOrderStatus, {
    message: 'Trạng thái đơn hàng không hợp lệ',
  })
  status?: EOrderStatus;

  @ApiProperty({
    description: 'Trạng thái đơn hàng',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'ID đơn hàng phải là một chuỗi' })
  trackingNumber?: string;

  @ApiProperty({
    description: 'Ghi chú',
    example: 'Giao ngay',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Ghi chú phải là một chuỗi' })
  notes?: string;
}
