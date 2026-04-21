import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { CartService } from './cart.service';
import { CartResponseDto } from './dto/cart-response.dto';
import { AddToCartDto, MergeGuestCartDto } from './dto/create-cart.dto';
import { UpdateCartItemQuantityDto } from './dto/update-cart.dto';

@ApiTags('Cart - Giỏ hàng')
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Get or create cart api
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy / tạo giỏ hàng theo ID người dùng',
    description: 'Lấy / tạo giỏ hàng theo ID người dùng',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy / tạo giỏ hàng theo ID người dùng thanh cong',
    type: CartResponseDto,
  })
  async getOrCreateCart(
    @GetUser('id') userId: string,
  ): Promise<CartResponseDto> {
    return await this.cartService.getOrCreateCart(userId);
  }

  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Thêm món hàng với giỏ hàng',
    description: 'Thêm món hàng với giỏ hàng',
  })
  @ApiBody({
    type: AddToCartDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Thêm món hàng với giỏ hàng thanh cong',
    type: CartResponseDto,
  })
  async addToCart(
    @GetUser('id') userId: string,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<CartResponseDto> {
    return await this.cartService.addToCart(userId, addToCartDto);
  }

  // Update cart item (product) quantity in cart api
  @Patch('items/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cập nhật số lượng món hàng (sản phẩm) trong giỏ hàng',
    description: 'Cập nhật số lượng món hàng (sản phẩm) trong giỏ hàng',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID món hàng trong giỏ hàng',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Cập nhật số lượng món hàng (sản phẩm) trong giỏ hàng thanh cong',
    type: CartResponseDto,
  })
  async updateCartItemQuantity(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateCartItemQuantityDto: UpdateCartItemQuantityDto,
  ): Promise<CartResponseDto> {
    return await this.cartService.updateCartItemQuantity(
      userId,
      id,
      updateCartItemQuantityDto,
    );
  }

  // Remove cart item (product) from cart api
  @Delete('items/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa món hàng (sản phẩm) trong giỏ hàng',
    description: 'Xóa món hàng (sản phẩm) trong giỏ hàng',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID món hàng trong giỏ hàng',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xóa món hàng (sản phẩm) trong giỏ hàng thanh cong',
    type: CartResponseDto,
  })
  async removeCartItem(
    @GetUser('id') userId: string,
    @Param('id') id: string,
  ): Promise<CartResponseDto> {
    return await this.cartService.removeCartItem(userId, id);
  }

  // Clear all cart items (products) in cart api
  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa tất cả môn hàng (sản phẩm) trong giỏ hàng',
    description: 'Xóa tất cả môn hàng (sản phẩm) trong giỏ hàng',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xóa tất cả môn hàng (sản phẩm) trong giỏ hàng thanh cong',
    type: CartResponseDto,
  })
  async clearCart(@GetUser('id') userId: string): Promise<CartResponseDto> {
    return await this.cartService.clearCart(userId);
  }

  // Merge guest cart with user cart api
  @Post('merge')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Gộp giỏ hàng người dùng với giỏ hàng khách',
    description: 'Gộp giỏ hàng người dùng với giỏ hàng khách',
  })
  @ApiBody({
    type: MergeGuestCartDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Gộp giỏ hàng người dùng với giỏ hàng khách thanh cong',
    type: CartResponseDto,
  })
  async mergeGuestCart(
    @GetUser('id') userId: string,
    @Body() mergeGuestCartDto: MergeGuestCartDto,
  ): Promise<CartResponseDto> {
    return await this.cartService.mergeGuestCart(userId, mergeGuestCartDto);
  }
}
