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
import { CategoryService } from './category.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Category - Danh mục')
@Controller('categoríes')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Create a new category api
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Tạo mới danh mục' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tạo mới danh mục thành công',
    type: CategoryResponseDto,
  })
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return await this.categoryService.createCategory(createCategoryDto);
  }

  // Get all categories api
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách danh mục' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách danh mục thành công',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/CategoryResponseDto' },
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
  async findAll(@Query() queryDto: QueryCategoryDto): Promise<{
    data: CategoryResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    return await this.categoryService.findAll(queryDto);
  }

  // Get category by id api
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy thông tin danh mục theo ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin danh mục thành công',
    type: CategoryResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<CategoryResponseDto> {
    return await this.categoryService.findOne(id);
  }

  // Get category by slug api
  @Get('slug/:slug')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy thông tin danh mục theo slug' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin danh mục thành công',
    type: CategoryResponseDto,
  })
  async findOneBySlug(
    @Param('slug') slug: string,
  ): Promise<CategoryResponseDto> {
    return await this.categoryService.findOneBySlug(slug);
  }

  // Update a category by id api
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cập nhật thông tin danh mục theo ID' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật thông tin danh mục thành công',
    type: CategoryResponseDto,
  })
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return await this.categoryService.updateCategory(id, updateCategoryDto);
  }

  // Delete a category by id api
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Xóa danh mục theo ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xóa danh mục thành công',
  })
  async hardDeleteCategory(@Param('id') id: string): Promise<{ message: string }> {
    return await this.categoryService.hardDeleteCategory(id);
  }
}
