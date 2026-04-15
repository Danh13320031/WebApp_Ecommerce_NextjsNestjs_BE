import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class OrderItemDto {
  @ApiProperty({
    description: 'ID sản phẩm',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty({ message: 'ID sản phẩm khoôn cơ bản' })
  @IsString({ message: 'ID sản phẩm phải là một chuỗi' })
  @IsUUID(4, { message: 'ID sản phẩm phải là một UUID phiên bản 4' })
  productId!: string;

  @ApiProperty({
    description: 'Số lượng sản phẩm',
    example: 2,
    required: true,
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'Số lượng sản phẩm không được để trống' })
  @IsNumber({}, { message: 'Số lượng sản phẩm phải là một số' })
  quantity!: number;

  @ApiProperty({
    description: 'Giá sản phẩm tại thời điểm đặt hàng',
    example: 299.99,
    required: true,
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'Giá sản phẩm không được để trống' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Giá sản phẩm phải là một số' })
  price!: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Các đơn hàng bao gồm sản phẩm và số lượng',
    required: true,
    type: [OrderItemDto],
  })
  @Type(() => OrderItemDto)
  @IsNotEmpty({ message: 'Đơn hàng phải có ít nhất một sản phẩm' })
  @IsArray({ message: 'Đơn hàng phải là một mảng' })
  @ValidateNested({ each: true })
  items!: OrderItemDto[];

  @ApiProperty({
    description: 'Địa chỉ giao hàng',
    example: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
    required: false,
  })
  @IsNotEmpty({ message: 'Địa chỉ giao hàng không được bỏ trống' })
  @IsString({ message: 'Địa chỉ giao hàng phải là một chuỗi' })
  shippingAddress!: string;
}
