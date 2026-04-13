import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'ID của sản phẩm',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Tên sản phẩm',
    example: 'Tai nghe Sony WH-1000XM4',
  })
  name!: string;

  @ApiProperty({
    description: 'Slug của sản phẩm',
    example: 'tai-nghe-sony-wh-1000xm4',
  })
  slug!: string;

  @ApiProperty({
    description: 'Mô tả sản phẩm',
    example:
      'Tai nghe Bluetooth Sony WH-1000XM4 với chất lượng âm thanh tuyệt vời và khả năng chống ồn hiệu quả.',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({
    description: 'Giá sản phẩm',
    example: 299.99,
  })
  price!: number;

  @ApiProperty({
    description: 'Số lượng tồn kho của sản phẩm',
    example: 100,
  })
  stock!: number;

  @ApiProperty({
    description: 'Mã SKU của sản phẩm',
    example: 'WH1000XM4-BLK',
  })
  sku!: string;

  @ApiProperty({
    description: 'URL hình ảnh của sản phẩm',
    example: 'https://example.com/images/wh1000xm4.jpg',
    nullable: true,
  })
  imageUrl!: string | null;

  @ApiProperty({
    description: 'ID danh mục của sản phẩm',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  category!: string | null;

  @ApiProperty({
    description: 'Trạng thái hoạt động của sản phẩm',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Trạng thái xóa của sản phẩm',
    example: false,
  })
  isDelete!: boolean;

  @ApiProperty({
    description: 'Ngày tạo của sản phẩm',
    example: '2024-06-01T12:00:00Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Ngày cập nhật của sản phẩm',
    example: '2024-06-10T15:30:00Z',
  })
  updatedAt!: Date;
}
