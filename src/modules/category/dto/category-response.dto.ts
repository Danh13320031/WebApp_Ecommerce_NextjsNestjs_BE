import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    description: 'ID của danh mục',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  id!: string;

  @ApiProperty({
    description: 'Tên danh mục',
    example: 'Điện thoại',
    required: true,
  })
  name!: string;

  @ApiProperty({
    description: 'Mô tả danh mục',
    example: 'Danh mục điện thoại bao gồm các sản phẩm điện thoại di động',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({
    description: 'Slug của danh mục',
    example: 'dien-thoai',
    nullable: true,
  })
  slug!: string | null;

  @ApiProperty({
    description: 'URL hình ảnh của danh mục',
    example: 'https://example.com/images/category.jpg',
    nullable: true,
  })
  imageUrl!: string | null;

  @ApiProperty({
    description: 'Trạng thái hoạt động của danh mục',
    example: true,
    default: true,
    required: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Trạng thái xóa danh mục',
    example: false,
    default: false,
    required: true,
  })
  isDelete!: boolean;

  @ApiProperty({
    description: 'Số lượng sản phẩm thuộc danh mục',
    example: 150,
    required: true,
  })
  productCount!: number;

  @ApiProperty({
    description: 'Ngày tạo danh mục',
    example: '2024-06-01T12:00:00Z',
    required: true,
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Ngày cập nhật danh mục',
    example: '2024-06-01T12:00:00Z',
    required: true,
  })
  updatedAt!: Date;
}
