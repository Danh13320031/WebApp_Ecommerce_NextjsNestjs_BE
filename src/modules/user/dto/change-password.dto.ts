import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { STRONG_PASSWORD_REGEX } from 'src/common/constants/regex.constant';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Mật khẩu cho người dùng',
    example: 'Duong@123',
    required: true,
    minLength: 8,
    pattern: `${STRONG_PASSWORD_REGEX}`,
  })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString({ message: 'Mật khẩu phải là một chuỗi' })
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  @Matches(STRONG_PASSWORD_REGEX, {
    message:
      'Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt',
  })
  currentPassword!: string;

  @ApiProperty({
    description: 'Mật khẩu mới cho người dùng',
    example: 'Duong@123',
    required: true,
    minLength: 8,
    pattern: `${STRONG_PASSWORD_REGEX}`,
  })
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  @IsString({ message: 'Mật khẩu mới phải là một chuỗi' })
  @MinLength(8, { message: 'Mật khẩu mới phải có ít nhất 8 ký tự' })
  @Matches(STRONG_PASSWORD_REGEX, {
    message:
      'Mật khẩu mới phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt',
  })
  newPassword!: string;
}
