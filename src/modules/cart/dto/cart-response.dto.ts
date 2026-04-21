import { ProductResponseDto } from '@/modules/product/dto/product-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CartItemResponseDto {
  @ApiProperty({
    description: 'ID 1 món hàng trong giỏ hàng',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty({ message: 'ID khóng được bỏ trống' })
  @IsString({ message: 'ID phải là một chuỗi' })
  @IsUUID(4, { message: 'ID phải là một UUID phiên bản 4' })
  id!: string;

  @ApiProperty({
    description: 'ID giỏ hàng',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty({ message: 'ID giỏ hàng khóng được bỏ trống' })
  @IsString({ message: 'ID giỏ hàng phải là một chuỗi' })
  @IsUUID(4, { message: 'ID giỏ hàng phải là một UUID phiên bản 4' })
  cartId!: string;

  @ApiProperty({
    description: 'ID sản phẩm',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty({ message: 'ID sản phẩm khóng được bỏ trống' })
  @IsString({ message: 'ID sản phẩm phải là một chuỗi' })
  @IsUUID(4, { message: 'ID sản phẩm phải là một UUID phiên bản 4' })
  productId!: string;

  @ApiProperty({
    description: 'Số lượng sản phẩm trong giỏ hàng',
    example: 2,
    required: true,
  })
  @IsNotEmpty({ message: 'Số lượng khóng được bỏ trống' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Số lượng phải là một số' })
  quantity!: number;

  @ApiProperty({
    description: 'Chi tiết sản phẩm trong giỏ hàng',
    example: {},
    required: true,
    type: ProductResponseDto,
  })
  @IsNotEmpty({ message: 'Chi tiết sản phẩm khóng được bỏ trống' })
  product!: ProductResponseDto;

  @ApiProperty({
    description: 'Thời gian tạo giỏ hàng',
    example: '2022-01-01T00:00:00.000Z',
    required: true,
  })
  @IsNotEmpty({ message: 'Thời gian tạo khóng được bỏ trống' })
  @Type(() => Date)
  @IsDate({ message: 'Thời gian tạo phải là một ngày' })
  createdAt!: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật giỏ hàng',
    example: '2022-01-01T00:00:00.000Z',
    required: true,
  })
  @IsNotEmpty({ message: 'Thời gian cập nhật khóng được bỏ trống' })
  @Type(() => Date)
  @IsDate({ message: 'Thời gian cập nhật phải là một ngày' })
  updatedAt!: Date;
}

export class CartResponseDto {
  @ApiProperty({
    description: 'ID giỏ hàng',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty({ message: 'ID không được bỏ trống' })
  @IsString({ message: 'ID phải là một chuỗi' })
  @IsUUID(4, { message: 'ID phải là một UUID phiên bản 4' })
  id!: string;

  @ApiProperty({
    description: 'ID người dùng',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty({ message: 'ID người dùng không được bỏ trống' })
  @IsString({ message: 'ID người dùng phải là một chuỗi' })
  @IsUUID(4, { message: 'ID người dùng phải là một UUID phiên bản 4' })
  userId!: string;

  @ApiProperty({
    description: 'Danh sách các món hàng trong giỏ hàng',
    example: [],
    required: true,
    type: [CartItemResponseDto],
  })
  @IsNotEmpty({ message: 'Danh sách hàng trong giỏ hàng khóng được bỏ trống' })
  cartItems!: CartItemResponseDto[];

  @ApiProperty({
    description: 'Tổng giá trị giỏ hàng',
    example: 299.99,
    required: true,
  })
  @IsNotEmpty({ message: 'Tổng giá trị khóng được bỏ trống' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Tổng giá trị phải là một số' })
  totalPrice!: number;

  @ApiProperty({
    description: 'Tổng sở lượng món hàng trong giỏ hàng',
    example: 2,
    required: true,
  })
  @IsNotEmpty({ message: 'Tổng sở lượng khóng được bỏ trống' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Tổng sở lượng phải là một số' })
  totalItems!: number;

  @ApiProperty({
    description: 'Thời gian tạo giỏ hàng',
    example: '2022-01-01T00:00:00.000Z',
    required: true,
  })
  @IsNotEmpty({ message: 'Thời gian tạo khóng được bỏ trống' })
  @Type(() => Date)
  @IsDate({ message: 'Thời gian tạo phải là một ngày' })
  createdAt!: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật giỏ hàng',
    example: '2022-01-01T00:00:00.000Z',
    required: true,
  })
  @IsNotEmpty({ message: 'Thời gian cập nhật khóng được bỏ trống' })
  @Type(() => Date)
  @IsDate({ message: 'Thời gian cập nhật phải là một ngày' })
  updatedAt!: Date;
}
