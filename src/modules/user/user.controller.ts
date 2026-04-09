import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
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
}
