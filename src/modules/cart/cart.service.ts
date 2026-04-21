import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cart, CartItem } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItemResponseDto, CartResponseDto } from './dto/cart-response.dto';
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartItemQuantityDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateCart(userId: string): Promise<CartResponseDto> {
    return await this.getOrCreateActiveCart(userId);
  }

  async addToCart(
    userId: string,
    addToCartDto: AddToCartDto,
  ): Promise<CartResponseDto> {
    const { productId, quantity } = addToCartDto;
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product)
      throw new NotFoundException(`Không tìm thấy sản phẩm: ${productId}`);
    if (!product.isActive)
      throw new BadRequestException(`Sản phẩm: ${productId} dừng hoạt động`);
    if (product.stock < quantity)
      throw new BadRequestException(
        `Sản phẩm ${product.name} hiện không còn trong kho. Lượng hàng tồn kho hiện có: ${product.stock}.`,
      );

    const cart = await this.getOrCreateActiveCart(userId);
    const existingCartItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
    });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;

      if (product.stock < newQuantity)
        throw new BadRequestException(
          `Sản phẩm ${product.name} hiện không còn trong kho. Lượng hàng tồn kho hiện có: ${product.stock}.`,
        );

      await this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity,
        },
      });
    }

    return await this.getOrCreateActiveCart(userId);
  }

  async updateCartItemQuantity(
    userId: string,
    id: string,
    updateCartItemQuantityDto: UpdateCartItemQuantityDto,
  ): Promise<CartResponseDto> {
    const { quantity } = updateCartItemQuantityDto;
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: id },
      include: { cart: true, product: true },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      throw new NotFoundException('Không tìm thấy sản phẩm trong giỏ hàng');
    }

    if (cartItem.product.stock < quantity) {
      throw new BadRequestException(
        `Sản phẩm ${cartItem.product.name} hiện không còn trong kho. Lượng hàng tồn kho hiện có: ${cartItem.product.stock}.`,
      );
    }

    await this.prisma.cartItem.update({
      where: { id: id },
      data: { quantity: quantity },
    });

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
