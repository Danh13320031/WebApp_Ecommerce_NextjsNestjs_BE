import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { STRONG_PASSWORD_REGEX } from 'src/common/constants/regex.constant';

export class LoginDto {
  @IsNotEmpty({ message: 'Địa chỉ email không được để trống' })
  @IsString({ message: 'Địa chỉ email phải là một chuỗi' })
  @IsEmail({}, { message: 'Địa chỉ email không hợp lệ' })
  email!: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString({ message: 'Mật khẩu phải là một chuỗi' })
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  @Matches(STRONG_PASSWORD_REGEX, {
    message:
      'Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt',
  })
  password!: string;
}
