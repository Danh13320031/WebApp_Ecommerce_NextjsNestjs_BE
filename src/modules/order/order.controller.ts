import {
  Body,
  Controller,
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
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ERole } from '@prisma/client';
import {
  ModerateThrottler,
  RelaxedThrottler,
} from 'src/common/decorators/custom-throttler.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  OrderApiResponseDto,
  OrderResponseDto,
} from './dto/order-response.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderService } from './order.service';

@ApiTags('Order - Đơn hàng')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Create a new order api
  @Post('create')
  @ModerateThrottler()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo đơn hàng' })
  @ApiBody({
    description: 'Thông tin đơn hàng cần tạo',
    required: true,
    type: CreateOrderDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tạo mới đơn hàng thành công',
    type: OrderApiResponseDto,
  })
  async createOrder(
    @GetUser('id') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    return await this.orderService.createOrder(userId, createOrderDto);
  }

  // Admin get all orders api
  @Get('/admin/all')
  @RelaxedThrottler()
  @HttpCode(HttpStatus.OK)
  @Roles(ERole.ADMIN)
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng' })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách đơn hàng thanh cong',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            $ref: getSchemaPath(OrderResponseDto),
          },
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
  @ApiForbiddenResponse({ description: 'Admin access required' })
  async findAllOrderForAdmin(@Query() queryDto: QueryOrderDto): Promise<{
    data: OrderResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    return await this.orderService.findAllOrderForAdmin(queryDto);
  }

  // User get own orders api
  @Get()
  @HttpCode(HttpStatus.OK)
  @RelaxedThrottler()
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng của người dùng hiện tại' })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách đơn hàng thanh cong',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            $ref: getSchemaPath(OrderResponseDto),
          },
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
  async findAllOrder(
    @GetUser('id') userId: string,
    @Query() queryDto: QueryOrderDto,
  ): Promise<{
    data: OrderResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    return await this.orderService.findAllOrder(userId, queryDto);
  }

  // Admin get a order by id
  @Get('admin/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(ERole.ADMIN)
  @RelaxedThrottler()
  @ApiOperation({ summary: 'Lấy đơn hàng theo id cho admin' })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy đơn hàng thành công',
    type: OrderApiResponseDto,
  })
  async findOneOrderForAdmin(
    @Param('id') id: string,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    return await this.orderService.findOneOrderForAdmin(id);
  }

  // User get a order by id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @RelaxedThrottler()
  @ApiOperation({ summary: 'Lấy đơn hàng theo id cho người dùng hiện tại' })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy đơn hàng thành công',
    type: OrderApiResponseDto,
  })
  async findOneOrder(
    @GetUser('id') userId: string,
    @Param('id') id: string,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    return await this.orderService.findOneOrder(userId, id);
  }

  // Admin update order api
  @Patch('admin/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(ERole.ADMIN)
  @RelaxedThrottler()
  @ApiOperation({ summary: 'Chiềnh sách đơn hàng theo id cho admin' })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Chiềnh sách đơn hàng thanh cong',
    type: OrderApiResponseDto,
  })
  async updateOrderForAdmin(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    return await this.orderService.updateOrderForAdmin(id, updateOrderDto);
  }
}
