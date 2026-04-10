import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import convertTextToSlug from 'src/common/helpers/text-to-slug.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const { name, slug, ...rest } = createCategoryDto;
    const categorySlug = slug ?? convertTextToSlug(name);
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (existingCategory) {
      throw new Error('Danh mục đã tồn tại: ' + categorySlug);
    }

    const category = await this.prisma.category.create({
      data: {
        name,
        slug: categorySlug,
        ...rest,
      },
    });

    return this.formatCategoryResponse(category, 0);
  }

  private formatCategoryResponse(
    category: Category,
    productCount: number,
  ): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      slug: category.slug,
      imageUrl: category.imageUrl,
      isActive: category.isActive,
      isDelete: category.isDelete,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      productCount: productCount,
    };
  }
}
