import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ERole } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@ApiTags('Product - Sản phẩm')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Create a new product api
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Tạo mới sản phẩm' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tạo mới sản phẩm thành công',
    type: ProductResponseDto,
  })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return await this.productService.createProduct(createProductDto);
  }

  // Get product list api
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách sản phẩm thành công',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#components/schemas/ProductResponseDto' },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  async findAllProduct(@Query() queryProductDto: QueryProductDto): Promise<{
    data: ProductResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    return await this.productService.findAllProduct(queryProductDto);
  }

  // Get product by id api
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy thông tin sản phẩm theo ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin sản phẩm thành công',
    type: ProductResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    return await this.productService.findOneProduct(id);
  }

  // Update product by id api
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cập nhật thông tin sản phẩm theo ID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật thông tin sản phẩm thành công',
    type: ProductResponseDto,
  })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return await this.productService.updateProduct(id, updateProductDto);
  }

  // Update product stock by id api
  @Patch(':id/stock')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cập nhật số lượng tồn kho của sản phẩm theo ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quantity: {
          type: 'number',
          description: 'Tông số lượng sản phẩm trong kho',
          example: 50,
        },
      },
      required: ['quantity'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật số lượng tồn kho của sản phẩm thành cong',
    type: ProductResponseDto,
  })
  async updateProductStock(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ): Promise<ProductResponseDto> {
    return await this.productService.updateProductStock(id, quantity);
  }

  // Hard delete product by id api
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Xóa sản phẩm theo ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xóa sản phẩm thành công',
  })
  async hardDeleteProduct(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return await this.productService.hardDeleteProduct(id);
  }
}
