import {
  Body,
  Controller,
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
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartItemQuantityDto } from './dto/update-cart.dto';

@ApiTags('Cart - Giỏ hàng')
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

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

  // Update cart item quantity in cart
  @Patch('items/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cập nhật lượng món hàng trong giỏ hàng',
    description: 'Cập nhật lượng món hàng trong giỏ hàng',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID món hàng trong giỏ hàng',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật lượng món hàng trong giỏ hàng thanh cong',
    type: CartResponseDto,
  })
  async updateCartItemQuantity(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateCartItemQuantityDto: UpdateCartItemQuantityDto,
  ): Promise<CartResponseDto> {
    return await this.cartService.updateCartItemQuantity(userId, id, updateCartItemQuantityDto);
  }
}
