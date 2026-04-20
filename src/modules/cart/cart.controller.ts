import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { CartService } from './cart.service';
import { CartResponseDto } from './dto/cart-response.dto';

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
    description: 'Success',
    type: CartResponseDto,
  })
  async getOrCreateCart(@GetUser('id') userId: string) {
    return await this.cartService.getOrCreateCart(userId);
  }
}
