import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CartItemDto {
  @ApiProperty({
    description: 'Id sản phẩm',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty({ message: 'ID khóng được bỏ trống' })
  @IsString({ message: 'ID phải là một chuỗi' })
  @IsUUID(4, { message: 'ID phải là một UUID phiên bản 4' })
  productId!: string;

  @ApiProperty({
    description: 'Số lượng sản phẩm',
    example: 2,
    required: true,
  })
  @IsNotEmpty({ message: 'Số lượng khóng được bỏ trống' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Số lượng phải là một số' })
  quantity!: number;
}

export class AddToCartDto {
  @ApiProperty({
    description: 'Id sản phẩm',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty({ message: 'ID khóng được bỏ trống' })
  @IsString({ message: 'ID phải là một chuỗi' })
  @IsUUID(4, { message: 'ID phải là một UUID phiên bản 4' })
  productId!: string;

  @ApiProperty({
    description: 'Số lượng sản phẩm',
    example: 2,
    required: true,
  })
  @IsNotEmpty({ message: 'Số lượng khóng được bỏ trống' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Số lượng phải là một số' })
  quantity!: number;
}

export class MergeGuestCartDto {
  @ApiProperty({
    description: 'Danh sách các món hàng trong giỏ hàng',
    required: true,
    type: [CartItemDto],
  })
  @IsNotEmpty({ message: 'Danh sách hàng trong giỏ hàng khóng được bỏ trống' })
  @IsArray({ message: 'Danh sách hàng trong giỏ hàng phải la mảng' })
  items!: CartItemDto[];
}

export class CreateCartDto {}
