import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EOrderStatus, Order, OrderItem, Product, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  OrderApiResponseDto,
  OrderResponseDto,
} from './dto/order-response.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    const { items, shippingAddress } = createOrderDto;

    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(
          `Không tìm thấy sản phẩm: ${item.productId}`,
        );
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Sản phẩm ${product.name} hiện không còn trong kho. Lượng hàng tồn kho hiện có: ${product.stock}. Số lượng yêu cầu: ${item.quantity}.`,
        );
      }
    }

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const latestCart = await this.prisma.cart.findFirst({
      where: { userId, checkedOut: false },
      orderBy: { createdAt: 'desc' },
    });

    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          status: EOrderStatus.PENDING,
          totalAmount: total,
          shippingAddress,
          cartId: latestCart?.id,
          orderItems: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    return this.wrap(order);
  }

  async findAllOrderForAdmin(queryDto: QueryOrderDto): Promise<{
    data: OrderResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const { page = 1, limit = 10, status, search } = queryDto;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        {
          id: {
            contains: search,
            mode: 'insensitive',
          },
          orderNumber: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          user: true,
        },
        orderBy: { createdAt: 'desc' },
      }),

      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders.map((order) => this.map(order)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllOrder(
    userId: string,
    queryDto: QueryOrderDto,
  ): Promise<{
    data: OrderResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const { page = 1, limit = 10, status, search } = queryDto;
    const skip = (page - 1) * limit;
    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        {
          id: {
            contains: search,
            mode: 'insensitive',
          },
          orderNumber: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          user: true,
        },
        orderBy: { createdAt: 'desc' },
      }),

      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders.map((order) => this.map(order)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneOrderForAdmin(
    id: string,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    const where: any = { id };

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    return this.wrap(order);
  }

  async findOneOrder(
    id: string,
    userId?: string,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    const where: any = { id };

    if (userId) {
      where.userId = userId;
    }

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    return this.wrap(order);
  }

  async updateOrderForAdmin(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    const where: any = { id };
    const order = await this.prisma.order.findFirst({ where });

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng ${id}`);
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: order.id },
      data: updateOrderDto,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    return this.wrap(updatedOrder);
  }

  async updateOrder(
    id: string,
    userId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    const where: any = { id, userId };
    const order = await this.prisma.order.findFirst({ where });

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng ${id}`);
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: order.id },
      data: updateOrderDto,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    return this.wrap(updatedOrder);
  }

  async cancelOrderForAdmin(
    id: string,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng ${id}`);
    }

    if (order.status !== EOrderStatus.PENDING) {
      throw new BadRequestException(
        'Chỉ có thể xóa đơn hàng với trạng thái PENDING',
      );
    }

    const cancelledOrder = await this.prisma.$transaction(async (tx) => {
      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      return tx.order.update({
        where: { id: order.id },
        data: {
          status: EOrderStatus.CANCELLED,
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });
    });

    return this.wrap(cancelledOrder);
  }

  async cancelOrder(
    userId: string,
    id: string,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    const where: any = { id, userId };
    const order = await this.prisma.order.findFirst({ where });

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng ${id}`);
    }

    if (order.status !== EOrderStatus.PENDING) {
      throw new BadRequestException(
        'Chỉ có thể xóa đơn hàng với trạng thái PENDING',
      );
    }

    const cancelledOrder = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        status: EOrderStatus.CANCELLED,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    return this.wrap(cancelledOrder);
  }

  private wrap(
    order: Order & {
      user: User;
      orderItems: (OrderItem & { product: Product })[];
    },
  ): OrderApiResponseDto<OrderResponseDto> {
    return {
      success: true,
      message: 'Đơn hàng được tạo thành công',
      data: this.map(order),
    };
  }

  private map(
    order: Order & {
      user: User;
      orderItems: (OrderItem & { product: Product })[];
    },
  ): OrderResponseDto {
    return {
      id: order.id,
      userId: order.userId,
      status: order.status,
      total: Number(order.totalAmount.toFixed(2)),
      shippingAddress: order.shippingAddress ?? '',
      items: order.orderItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: Number(item.price.toFixed(2)),
        subtotal: Number((Number(item.price) * item.quantity).toFixed(2)),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      })),
      ...(order.user && {
        userEmail: order.user.email,
        userName:
          `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim(),
      }),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
