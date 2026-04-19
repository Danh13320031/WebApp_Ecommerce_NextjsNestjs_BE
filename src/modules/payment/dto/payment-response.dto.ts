import { ApiProperty } from '@nestjs/swagger';
import { EPaymentStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class PaymentResponseDto {
  @ApiProperty({
    description: 'ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty({
    message: 'ID khóng được trống',
  })
  @IsString({
    message: 'ID phải là một chuỗi',
  })
  @IsUUID(4, {
    message: 'ID phải là một UUID phiên bản 4',
  })
  id!: string;

  @ApiProperty({
    description: 'ID đơn hàng',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty({
    message: 'ID đơn hàng khóng được trONGL',
  })
  @IsString({
    message: 'ID đơn hàng phải là một chuỗi',
  })
  @IsUUID(4, {
    message: 'ID đơn hàng phải là một UUID phiên bản 4',
  })
  orderId!: string;

  @ApiProperty({
    description: 'ID người dùng',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty({
    message: 'ID người dùng khóng được trONGL',
  })
  @IsString({
    message: 'ID người dùng phải là một chuỗi',
  })
  @IsUUID(4, {
    message: 'ID người dùng phải là một UUID phiên bản 4',
  })
  userId!: string;

  @ApiProperty({
    description: 'Mã giao dịch',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString({
    message: 'ID giao dịch phải là một chuỗi',
  })
  transactionId?: string | null;

  @ApiProperty({
    description: 'Tổng tiền thanh toán',
    example: 299.99,
    required: true,
  })
  @IsNotEmpty({
    message: 'Giá trị thanh toán khóng được trONGL',
  })
  @Type(() => Number)
  @IsNumber(
    {
      maxDecimalPlaces: 2,
    },
    {
      message: 'Giá trị thanh toán phải là một số',
    },
  )
  amount!: number;

  @ApiProperty({
    description: 'Giá trị tiền tệ',
    example: 'usd',
    required: true,
  })
  @IsNotEmpty({
    message: 'Giá trị tiền tệ khóng được trống',
  })
  @IsString({
    message: 'Giá trị tiền tệ phải là một chuỗi',
  })
  currency!: string;

  @ApiProperty({
    description: 'Trạng thái thanh toán',
    example: EPaymentStatus.PENDING,
    required: true,
  })
  @IsNotEmpty({
    message: 'Trạng thái thanh toán khóng được trống',
  })
  @IsEnum(EPaymentStatus, {
    message: 'Trạng thái thanh toán khóng hợp lệ',
  })
  status!: EPaymentStatus;

  @ApiProperty({
    description: 'Phuong thức thanh toán',
    example: 'STRIPE',
    required: true,
    nullable: true,
  })
  @IsOptional()
  @IsString({
    message: 'Phuong thức thanh toán phải là một chuỗi',
  })
  paymentMethod?: string | null;

  @ApiProperty({
    description: 'Thoi gian tạo',
    example: new Date(),
    required: true,
  })
  @IsNotEmpty({
    message: 'Thoi gian tạo khóng được trống',
  })
  @Type(() => Date)
  @IsDate({
    message: 'Thoi gian tạo phải la một ngày',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Thoi gian cap nhật',
    example: new Date(),
    required: true,
  })
  @IsNotEmpty({
    message: 'Thoi gian cap nhật khóng được trống',
  })
  @Type(() => Date)
  @IsDate({
    message: 'Thoi gian cap nhật phải la một ngày',
  })
  updatedAt!: Date;
}

export class CreatePaymentIntentResponseDto {
  @ApiProperty({
    example: 'pi_165465465',
    description: 'clientSecret cho phuong thức thanh toán Stripe',
    required: true,
  })
  @IsNotEmpty({
    message: 'clientSecret khóng được trống',
  })
  clientSecret!: string | null;

  @ApiProperty({
    example: '2165465-454-sds4s854d65',
    description: 'ID thanh toán Stripe',
  })
  paymentId!: string;
}

export class CreatePaymentIntentApiResponseDto {
  @ApiProperty({
    description: 'Trạng thái thành công',
    example: true,
    required: true,
  })
  @IsNotEmpty({
    message: 'Trạng thái tính công khóng được trONGL',
  })
  @Type(() => Boolean)
  @IsBoolean({
    message: 'Trạng thái tính công phải là một giá trị boolean',
  })
  success!: boolean;

  @ApiProperty({
    description: 'Tài liệu phản hồi',
    required: true,
    type: CreatePaymentIntentResponseDto,
  })
  @IsNotEmpty({
    message: 'Tài liệu phản hồi khóng được trống',
  })
  data!: CreatePaymentIntentResponseDto;

  @ApiProperty({
    example: 'Thanh toán thanh cong',
    required: false,
  })
  message?: string;
}

export class PaymentApiResponseDto {
  @ApiProperty({
    description: 'Trạng thái thành công',
    example: true,
    required: true,
  })
  @IsNotEmpty({
    message: 'Trạng thái thành công khóng được trống',
  })
  @Type(() => Boolean)
  @IsBoolean({
    message: 'Trạng thái thành công phải là một giá trị boolean',
  })
  success!: boolean;

  @ApiProperty({
    description: 'Tài liệu phản hồi',
    required: true,
    type: PaymentResponseDto,
  })
  @IsNotEmpty({
    message: 'Tài liệu phản hồi khóng được trống',
  })
  data!: PaymentResponseDto;

  @ApiProperty({
    description: 'Thông điệp phản hồi',
    example: 'Thanh toán thanh cong',
    required: false,
  })
  @IsOptional()
  @IsString({
    message: 'Thông điệp phản hồi phải là một chuỗi',
  })
  message?: string;
}
