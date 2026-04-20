import { Injectable } from '@nestjs/common';
import { Cart, CartItem } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItemResponseDto, CartResponseDto } from './dto/cart-response.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateCart(userId: string): Promise<CartResponseDto> {
    return await this.getOrCreateActiveCart(userId);
  }

  private formatCartResponse(
    cart: Cart & { cartItems: CartItem[] },
  ): CartResponseDto {
    const cartItems: CartItemResponseDto[] = cart.cartItems.map(
      (item: any) => ({
        id: item.id,
        cartId: item.cartId,
        productId: item.productId,
        quantity: item.quantity,
        product: {
          ...item.product,
          price: Number(item.product.price),
        },
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }),
    );

    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      id: cart.id,
      userId: cart.userId,
      cartItems,
      totalPrice,
      totalItems,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }

  private async getOrCreateActiveCart(
    userId: string,
  ): Promise<CartResponseDto> {
    let cart = await this.prisma.cart.findFirst({
      where: { userId: userId, checkedOut: false },
      include: { cartItems: { include: { product: true } } },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId: userId },
        include: { cartItems: { include: { product: true } } },
      });
    }

    return this.formatCartResponse(cart);
  }
}
