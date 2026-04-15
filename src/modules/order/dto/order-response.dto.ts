import { ApiProperty } from '@nestjs/swagger';
import { EOrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class OrderApiResponseDto<T> {
  @ApiProperty({
    description: 'Trạng thái thành công của phản hồi',
    example: true,
    required: true,
  })
  @Type(() => Boolean)
  @IsNotEmpty({
    message: 'Trạng thái thành công của phản hồi không được để trống',
  })
  @IsBoolean({
    message: 'Trạng thái thành công của phản hồi phải là một giá trị boolean',
  })
  success!: boolean;

  @ApiProperty({
    description: 'Thông điệp phản hồi',
    example: 'Đơn hàng đã được tạo thành công',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'Thông điệp phản hồi phải là một chuỗi' })
  message?: string | null;

  @ApiProperty({
    description: 'Dữ liệu phản hồi của đơn hàng',
    required: true,
    type: Object,
  })
  @Type(() => Object)
  @IsNotEmpty({ message: 'Dữ liệu phản hồi của đơn hàng không được để trống' })
  data!: T;
}

export class OrderItemResponseDto {
  @ApiProperty({
    description: 'ID đơn hàng',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty({ message: 'ID đơn hàng không được để trống' })
  @IsString({ message: 'ID đơn hàng phải là một chuỗi' })
  @IsUUID(4, { message: 'ID đơn hàng phải là một UUID phiên bản 4' })
  id!: string;

  @ApiProperty({
    description: 'ID sản phẩm',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty({ message: 'ID sản phẩm không được để trống' })
  @IsString({ message: 'ID sản phẩm phải là một chuỗi' })
  @IsUUID(4, { message: 'ID sản phẩm phải là một UUID phiên bản 4' })
  productId!: string;

  @ApiProperty({
    description: 'Tên sản phẩm',
    example: 'Tai nghe Bluetooth Sony WH-1000XM4',
    required: true,
  })
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  @IsString({ message: 'Tên sản phẩm phải là một chuỗi' })
  productName!: string;

  @ApiProperty({
    description: 'Số lượng sản phẩm',
    example: 2,
    required: true,
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'Số lượng sản phẩm không được để trống' })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'Số lượng sản phẩm phải là một số nguyen' },
  )
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

  @ApiProperty({
    description: 'Tổng tiền của sản phẩm',
    example: 599.98,
    required: true,
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'Tổng tiền của sản phẩm khong duoc se trong' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Tổng tiền của sản phẩm phai la mot so' },
  )
  subtotal!: number;

  @ApiProperty({
    description: 'Thời gian tạo đơn hàng',
    example: '2023-01-01T00:00:00.000Z',
    required: true,
  })
  @Type(() => Date)
  @IsNotEmpty({ message: 'Thời gian tạo đơn hàng khong duoc se trong' })
  @IsDate({ message: 'Thời gian tạo đơn hàng phai la mot ngay' })
  createdAt!: Date;
}

export class OrderResponseDto {
  @ApiProperty({
    description: 'ID danh sách đơn hàng',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty({ message: 'ID danh sách đơn hàng không được để trống' })
  @IsString({ message: 'ID danh sách đơn hàng phải là một chuỗi' })
  @IsUUID(4, { message: 'ID danh sách đơn hàng phải là một UUID phiên bản 4' })
  id!: string;

  @ApiProperty({
    description: 'ID người dùng',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty({ message: 'ID người dùng không được sé trống' })
  @IsString({ message: 'ID người dùng phải là một chuỗi' })
  @IsUUID(4, { message: 'ID người dùng phải là một UUID phiên bản 4' })
  userId!: string;

  @ApiProperty({
    description: 'Trạng thái đơn hàng',
    example: EOrderStatus.PENDING,
    required: true,
  })
  @IsNotEmpty({ message: 'Trạng thái đơn hàng không được để trống' })
  @IsString({ message: 'Trạng thái đơn hàng phải là một chuỗi' })
  status!: string;

  @ApiProperty({
    description: 'Tống giá trị đơn hàng',
    example: 299.99,
    required: true,
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'Tống giá trị đơn hàng không được để trống' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Tống giá trị đơn hàng phải là một số' },
  )
  total!: number;

  @ApiProperty({
    description: 'Địa chỉ giao hàng',
    example: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
    required: false,
  })
  @IsNotEmpty({ message: 'Địa chiề giao hàng khong duoc se trong' })
  @IsString({ message: 'Địa chiề giao hàng phải là một chuỗi' })
  shippingAddress!: string;

  @ApiProperty({
    description: 'Danh sách sản phẩm trong đơn hàng',
    required: true,
    type: [OrderItemResponseDto],
  })
  @IsNotEmpty({
    message: 'Danh sách sản phẩm trong đơn hàng khong duoc se trong',
  })
  @IsArray({ message: 'Danh sách sản phẩm trong đơn hàng phai la mot mang' })
  @ValidateNested({ each: true })
  items!: OrderItemResponseDto[];

  @ApiProperty({
    description: 'Thời gian tạo đơn hàng',
    example: '2023-01-01T00:00:00.000Z',
    required: true,
  })
  @Type(() => Date)
  @IsNotEmpty({ message: 'Thời gian tạo đơn hàng khong duoc se trong' })
  @IsDate({ message: 'Thời gian tạo đơn hàng phai la mot ngay' })
  createdAt!: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật đơn hàng',
    example: '2023-01-01T00:00:00.000Z',
    required: true,
  })
  @Type(() => Date)
  @IsNotEmpty({ message: 'Thời gian cập nhật đơn hàng khong duoc se trong' })
  @IsDate({ message: 'Thời gian cập nhật đơn hàng phai la mot ngay' })
  updatedAt!: Date;
}
