import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePaymentIntentDto {
  @ApiProperty({
    description: 'ID đơn hàng',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
    type: String,
  })
  @IsNotEmpty({ message: 'ID đơn hàng không được bỏ trống' })
  @IsString({ message: 'ID đơn hàng phải là một chuỗi' })
  @IsUUID(4, { message: 'ID đơn hàng phải là một UUID phiên bản 4' })
  orderId!: string;

  @ApiProperty({
    description: 'Số tiền thanh toán',
    example: 299.99,
    required: true,
    type: Number,
  })
  @IsNotEmpty({ message: 'Số tiền thanh toán không được bỏ trống' })
  @IsNumber({}, { message: 'Số tiền thanh toán phải là một số' })
  amount!: number;

  @ApiProperty({
    description: 'Loại tiền tệ',
    example: 'usd',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Loại tiền tệ phải là một chuỗi' })
  currency?: string = 'usd';

  @ApiProperty({
    description: 'Mô tả',
    example: 'Thanh toán đơn hàng',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Mô tả phải là một chuỗi' })
  description?: string;
}
