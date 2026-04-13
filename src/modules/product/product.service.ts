import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { Category, Prisma, Product } from '@prisma/client';
import convertTextToSlug from 'src/common/helpers/text-to-slug.helper';

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
