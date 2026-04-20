import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import {
  CreatePaymentConfirmationDto,
  CreatePaymentIntentDto,
} from './dto/create-payment.dto';
import {
  CreatePaymentIntentApiResponseDto,
  PaymentApiResponseDto,
  PaymentResponseDto,
} from './dto/payment-response.dto';
import { PaymentService } from './payment.service';

@Controller('payments')
@ApiTags('Payment - Thanh toán')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // Create payment intent api
  @Post('create-intent')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo intent thanh toán',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tạo intent thanh toán thành công',
    type: CreatePaymentIntentApiResponseDto,
  })
  async createPaymentIntent(
    @GetUser('id') userId: string,
    @Body() createPaymentIntentDto: CreatePaymentIntentDto,
  ): Promise<CreatePaymentIntentApiResponseDto> {
    return await this.paymentService.createPaymentIntent(
      userId,
      createPaymentIntentDto,
    );
  }

  // Confirm payment api
  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xác nhận thanh toán',
    description: 'Xác nhận thanh toán cho đơn hàng',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xác nhận thanh toán thành công',
  })
  async confirmPayment(
    @GetUser('id') userId: string,
    @Body() createPaymentConfirmationDto: CreatePaymentConfirmationDto,
  ): Promise<PaymentApiResponseDto> {
    return await this.paymentService.confirmPayment(
      userId,
      createPaymentConfirmationDto,
    );
  }

  // Get all payment api
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lay danh sách thanh toán',
    description: 'Lay danh sách thanh toán',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lay danh sách thanh toán thanh cong',
    type: PaymentApiResponseDto,
  })
  async findAllPayment(@GetUser('id') userId: string): Promise<{
    success: boolean;
    data: PaymentResponseDto[];
    message: string;
  }> {
    return await this.paymentService.findAllPayment(userId);
  }

  // Get one payment api
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy thông tin thanh toán theo id',
    description: 'Lấy thông tin thanh toán theo id',
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lay thong tin thanh toan thanh cong',
    type: PaymentApiResponseDto,
  })
  async findOnePayment(
    @GetUser('id') userId: string,
    @Param('id') id: string,
  ): Promise<PaymentApiResponseDto> {
    return await this.paymentService.findOnePayment(userId, id);
  }
}
