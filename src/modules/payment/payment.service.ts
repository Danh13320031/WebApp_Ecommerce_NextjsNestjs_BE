import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EPaymentStatus } from '@prisma/client';
import {
  STRIPE_API_VERSION_SECURITY,
  STRIPE_SECRET_SECURITY,
} from 'src/common/constants/security.constant';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';
import { CreatePaymentIntentDto } from './dto/create-payment.dto';
import { CreatePaymentIntentApiResponseDto } from './dto/payment-response.dto';

@Injectable()
export class PaymentService {
  private stripe: Stripe.Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(STRIPE_SECRET_SECURITY!, {
      apiVersion: STRIPE_API_VERSION_SECURITY,
    });
  }

  async createPaymentIntent(
    userId: string,
    createPaymentIntentDto: CreatePaymentIntentDto,
  ): Promise<CreatePaymentIntentApiResponseDto> {
    const { orderId, amount, currency = 'usd' } = createPaymentIntentDto;
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId: userId },
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng' + orderId);
    }

    const existingPayment = await this.prisma.payment.findFirst({
      where: { orderId: orderId },
    });

    if (
      existingPayment &&
      existingPayment.status === EPaymentStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'Thanh toán đã được hoàn tất cho đơn hàng' + orderId,
      );
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: { orderId, userId },
    });

    const payment = await this.prisma.payment.create({
      data: {
        orderId: orderId,
        userId: userId,
        amount: amount,
        currency: currency,
        status: EPaymentStatus.PENDING,
        paymentMethod: 'STRIPE',
        transactionId: paymentIntent.id,
      },
    });

    return {
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret!,
        paymentId: payment.id,
      },
      message: 'Thanh toán thành công',
    };
  }
}
