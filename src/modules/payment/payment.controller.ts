import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
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
}
