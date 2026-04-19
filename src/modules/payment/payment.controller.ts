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
import { CreatePaymentIntentDto } from './dto/create-payment.dto';
import { CreatePaymentIntentApiResponseDto } from './dto/payment-response.dto';
import { PaymentService } from './payment.service';

@Controller('payments')
@ApiTags('Payment - Thanh toán')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

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
}
