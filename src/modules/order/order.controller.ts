import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ModerateThrottler } from 'src/common/decorators/custom-throttler.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderApiResponseDto, OrderResponseDto } from './dto/order-response.dto';
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
}
