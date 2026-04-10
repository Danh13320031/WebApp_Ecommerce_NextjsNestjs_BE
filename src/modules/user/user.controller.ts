import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ERole } from '@prisma/client';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import type { IRequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';

@ApiTags('User - Người dùng')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // user profile api
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy thông tin người dùng hiện tại' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin người dùng thành công',
    type: UserResponseDto,
  })
  async getProfile(@Req() req: IRequestWithUser): Promise<UserResponseDto> {
    return await this.userService.getProfile(req.user.id);
  }

  // user list api
  @Get()
  @Roles(ERole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách người dùng' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách người dùng thành công',
  })
  async findAll(): Promise<UserResponseDto[]> {
    return await this.userService.findAll();
  }

  // user by id api
  @Get(':id')
  @Roles(ERole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy người dùng theo id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy người dùng theo id thành công',
    type: UserResponseDto,
  })
  async findOne(@Param() id: string): Promise<UserResponseDto> {
    return await this.userService.findOne(id);
  }

  // Update current user profile api
  @Patch('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật thông tin người dùng thành công',
    type: UserResponseDto,
  })
  async updateProfile(
    @GetUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.userService.updateProfile(userId, updateUserDto);
  }

  // Change current user password api
  @Patch('me/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cập nhật mật khẩu người dùng' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật mật khẩu người dùng thành công',
    type: UserResponseDto,
  })
  async changePassword(
    @GetUser('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return await this.userService.changePassword(userId, changePasswordDto);
  }

  // Hard delete current user account api
  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa tài khoản người dùng' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xóa tài khoản người dùng thành công',
  })
  async hardDeleteAccount(
    @GetUser('id') userId: string,
  ): Promise<{ message: string }> {
    return await this.userService.hardDeleteAccount(userId);
  }
}
