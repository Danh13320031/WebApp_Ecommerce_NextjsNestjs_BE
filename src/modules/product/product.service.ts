import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { Category, Prisma, Product } from '@prisma/client';
import convertTextToSlug from 'src/common/helpers/text-to-slug.helper';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const { name, slug, sku, price } = createProductDto;
    const productSlug = slug ?? convertTextToSlug(name);
    const existingSku = await this.prisma.product.findUnique({
      where: { sku: sku },
    });

    if (existingSku) {
      throw new ConflictException(
        `SKU của sản phẩm ${sku} đã tồn tại. Vui lòng chọn một SKU khác.`,
      );
    }

    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
        slug: productSlug,
        price: new Prisma.Decimal(price),
      },
      include: {
        category: true,
      },
    });

    return this.formatProductResponse(product);
  }

  async findAll(queryProductDto: QueryProductDto): Promise<{
    data: ProductResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const {
      category,
      isActive,
      search,
      page = 1,
      limit = 10,
    } = queryProductDto;
    const where: Prisma.ProductWhereInput = {};

    if (category) {
      where.categoryId = category;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await this.prisma.product.count({ where });
    const products = await this.prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });

    return {
      data: products.map((product) => this.formatProductResponse(product)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private formatProductResponse(
    product: Product & { category: Category },
  ): ProductResponseDto {
    return {
      ...product,
      price: Number(product.price),
      category: product.category.name,
    };
  }
}
