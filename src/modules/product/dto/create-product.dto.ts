import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Tên sản phẩm',
    example: 'Tai nghe Bluetooth Sony WH-1000XM4',
    required: true,
    minLength: 200,
  })
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  @IsString({ message: 'Tên sản phẩm phải là một chuỗi' })
  @MaxLength(200, { message: 'Tên sản phẩm không được vượt quá 200 ký tự' })
  name!: string;

  @ApiProperty({
    description:
      'Slug của sản phẩm (tùy chọn, nếu không cung cấp sẽ tự động tạo từ tên)',
    example: 'tai-nghe-bluetooth-sony-wh-1000xm4',
    required: false,
    minLength: 200,
  })
  @IsOptional()
  @IsString({ message: 'Slug phải là một chuỗi' })
  @MaxLength(200, { message: 'Slug không được vượt quá 200 ký tự' })
  slug?: string;

  @ApiProperty({
    description: 'Mô tả sản phẩm',
    example:
      'Tai nghe Bluetooth Sony WH-1000XM4 với chất lượng âm thanh tuyệt vời và khả năng chống ồn hiệu quả.',
    required: false,
    minLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Mô tả sản phẩm phải là một chuỗi' })
  @MaxLength(255, { message: 'Mô tả sản phẩm không được vượt quá 255 ký tự' })
  description?: string;

  @ApiProperty({
    description: 'Giá sản phẩm',
    example: 299.99,
    required: true,
  })
  @IsNotEmpty({ message: 'Giá sản phẩm không được để trống' })
  @Type(() => Number)
  @Min(0, { message: 'Giá sản phẩm phải lớn hơn hoặc bằng 0' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Giá sản phẩm phải là một số' })
  price!: number;

  @ApiProperty({
    description: 'Số lượng tồn kho của sản phẩm',
    example: 100,
    required: true,
  })
  @IsNotEmpty({ message: 'Số lượng tồn kho không được để trống' })
  @Type(() => Number)
  @Min(0, { message: 'Số lượng tồn kho phải lớn hơn hoặc bằng 0' })
  @IsNumber({}, { message: 'Số lượng tồn kho phải là một số nguyên' })
  stock!: number;

  @ApiProperty({
    description: 'SKU (Stock Keeping Unit) của sản phẩm',
    example: 'WH1000XM4-BLK',
    required: true,
    minLength: 50,
  })
  @IsNotEmpty({ message: 'Mã SKU không được để trống' })
  @IsString({ message: 'Mã SKU phải là một chuỗi' })
  @MaxLength(50, { message: 'Mã SKU không được vượt quá 50 ký tự' })
  sku!: string;

  @ApiProperty({
    description: 'URL hình ảnh của sản phẩm',
    example: 'https://example.com/images/wh1000xm4.jpg',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'URL hình ảnh phải là một chuỗi' })
  imageUrl?: string;

  @ApiProperty({
    description: 'ID danh mục của sản phẩm',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'ID danh mục phải là một chuỗi' })
  @IsUUID(4, { message: 'ID danh mục phải là một UUID hợp lệ' })
  categoryId!: string;

  @ApiProperty({
    description: 'Trạng thái hoạt động của sản phẩm',
    example: true,
    required: true,
    default: true,
  })
  @IsNotEmpty({ message: 'Trạng thái hoạt động không được để trống' })
  @Type(() => Boolean)
  @IsBoolean({ message: 'Trạng thái hoạt động phải là một giá trị boolean' })
  isActive!: boolean;

  @ApiProperty({
    description: 'Trạng thái xóa của sản phẩm',
    example: false,
    required: true,
    default: false,
  })
  @IsNotEmpty({ message: 'Trạng thái xóa không được để trống' })
  @Type(() => Boolean)
  @IsBoolean({ message: 'Trạng thái xóa phải là một giá trị boolean' })
  isDelete!: boolean;
}
