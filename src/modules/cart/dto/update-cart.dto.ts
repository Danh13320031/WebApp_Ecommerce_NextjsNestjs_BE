import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCartItemQuantityDto {
  @ApiProperty({
    description: 'Số lượng mô hình',
    example: 1,
    required: true,
  })
  @IsNotEmpty({ message: 'Số lượng khóng được bỏ trống' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Số lượng phải là một số' })
  quantity!: number;
}
