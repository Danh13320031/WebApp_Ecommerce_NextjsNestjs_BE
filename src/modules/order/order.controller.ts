import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOperation,
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
}
