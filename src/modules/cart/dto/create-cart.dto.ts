import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({
    description: 'Id sản phẩm',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty({ message: 'ID khóng được bỏ trONGL' })
  @IsString({ message: 'ID phải là một chuỗi' })
  @IsUUID(4, { message: 'ID phải là một UUID phiên bản 4' })
  productId!: string;

  @ApiProperty({
    description: 'Số lượng sản phẩm',
    example: 2,
    required: true,
  })
  @IsNotEmpty({ message: 'Số lượng khóng được bỏ trONGL' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Số lượng phải là một số' })
  quantity!: number;
}

export class CreateCartDto {}
