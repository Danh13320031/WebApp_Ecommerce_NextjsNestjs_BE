import {
  Body,
  Controller,
  Get,
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
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import type { IRequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';
import { ERole } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('User - Người dùng')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // user profile api
  @Get('me')
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
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật thông tin người dùng thành công',
    type: UserResponseDto,
  })
  async updateProfile(
    userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.userService.updateProfile(userId, updateUserDto);
  }
}
