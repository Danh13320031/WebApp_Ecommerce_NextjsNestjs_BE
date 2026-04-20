import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EOrderStatus, EPaymentStatus, Payment } from '@prisma/client';
import { STRIPE_API_VERSION_SECURITY } from 'src/common/constants/security.constant';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';
import {
  CreatePaymentConfirmationDto,
  CreatePaymentIntentDto,
} from './dto/create-payment.dto';
import {
  CreatePaymentIntentApiResponseDto,
  PaymentApiResponseDto,
  PaymentResponseDto,
} from './dto/payment-response.dto';

@Injectable()
export class PaymentService {
  private stripe: Stripe.Stripe;
  private stripeSecret: string | undefined;

  constructor(private prisma: PrismaService) {
    this.stripeSecret = process.env.STRIPE_SECRET
      ? process.env.STRIPE_SECRET
      : undefined;

    if (!this.stripeSecret) {
      throw new Error('Stripe secret key không tìm thấy');
    }

    this.stripe = new Stripe(this.stripeSecret, {
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

  async confirmPayment(
    userId: string,
    createPaymentConfirmationDto: CreatePaymentConfirmationDto,
  ): Promise<PaymentApiResponseDto> {
    const { paymentIntentId, orderId } = createPaymentConfirmationDto;
    const payment = await this.prisma.payment.findFirst({
      where: {
        orderId: orderId,
        userId: userId,
        transactionId: paymentIntentId,
      },
    });

    if (!payment) {
      throw new NotFoundException('Không tìm thấy hoạt động thanh toán');
    }

    if (payment.status === EPaymentStatus.COMPLETED) {
      throw new BadRequestException('Hoạt động thanh toán được hoàn tất');
    }

    const paymentItent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentItent.status !== 'succeeded') {
      throw new BadRequestException('Thanh toán khóng được hoàn tất');
    }

    const [updatedPayment] = await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: EPaymentStatus.COMPLETED,
        },
      }),

      this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: EOrderStatus.PROCESSING,
        },
      }),
    ]);

    const order = await this.prisma.order.findFirst({
      where: { id: orderId },
    });

    if (order?.cartId) {
      await this.prisma.cart.update({
        where: { id: order.cartId },
        data: {
          checkedOut: true,
        },
      });
    }

    return {
      success: true,
      data: this.formatPaymentResponse(updatedPayment),
      message: 'Thanh toán hoàn tất',
    };
  }

  async findAllPayment(userId: string): Promise<{
    success: boolean;
    data: PaymentResponseDto[];
    message: string;
  }> {
    const payments = await this.prisma.payment.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: payments.map((payment) => this.formatPaymentResponse(payment)),
      message: 'Thanh toán hoàn tất',
    };
  }

  async findOnePayment(
    userId: string,
    id: string,
  ): Promise<PaymentApiResponseDto> {
    const payment = await this.prisma.payment.findFirst({
      where: { id: id, userId: userId },
    });

    if (!payment) {
      throw new NotFoundException('Không tìm thấy hoạt động thanh toán');
    }

    return {
      success: true,
      data: this.formatPaymentResponse(payment),
      message: 'Thanh toán hoàn tất',
    };
  }

  async findPaymentByOrderId(
    orderId: string,
    userId: string,
  ): Promise<{
    success: boolean;
    data: PaymentResponseDto | null;
    message: string;
  }> {
    const payment = await this.prisma.payment.findFirst({
      where: { orderId: orderId, userId: userId },
    });

    if (!payment) {
      throw new NotFoundException('Không tìm thấy hoạt động thanh toán');
    }

    return {
      success: true,
      data: payment ? this.formatPaymentResponse(payment) : null,
      message: 'Thanh toán hoàn tất',
    };
  }

  private formatPaymentResponse(payment: Payment): PaymentResponseDto {
    return {
      id: payment.id,
      orderId: payment.orderId,
      userId: payment.userId,
      amount: payment.amount.toNumber(),
      currency: payment.currency,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}
