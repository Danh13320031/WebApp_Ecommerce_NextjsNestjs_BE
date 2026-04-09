import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        password: false,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        isActive: true,
        isDelete: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng hiện tại');
    }

    return user;
  }

  async findAll(): Promise<UserResponseDto[]> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        password: false,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        isActive: true,
        isDelete: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        password: false,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        isActive: true,
        isDelete: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return user;
  }

  async updateProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailTaken = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (emailTaken) {
        throw new NotFoundException('Địa chỉ email đã được đăng ký');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        password: false,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        isActive: true,
        isDelete: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }
}
