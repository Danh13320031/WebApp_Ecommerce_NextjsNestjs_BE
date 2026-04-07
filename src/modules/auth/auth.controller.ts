import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register api
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Đăng ký', description: 'Đăng ký người dùng' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Đăng ký thành công!',
    type: AuthResponseDto,
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return await this.authService.register(registerDto);
  }

  // Refresh access token api
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth('Refresh-JWT-auth')
  @ApiOperation({ summary: 'Refresh token', description: 'Refresh token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refresh token thành công!',
    type: AuthResponseDto,
  })
  async refresh(@GetUser('id') userId: string): Promise<AuthResponseDto> {
    return await this.authService.refreshTokens(userId);
  }

  // Logout api and validate refresh token
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Đăng xuất', description: 'Đăng xuất người dùng' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Đăng xuất thành công!',
  })
  async logout(@GetUser('id') userId: string): Promise<{ message: string }> {
    await this.authService.logout(userId);
    return { message: 'Đăng xuất thành công' };
  }

  // Login api
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập', description: 'Đăng nhập người dùng' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Đăng nhập thành công!',
    type: AuthResponseDto,
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return await this.authService.login(loginDto);
  }
}
