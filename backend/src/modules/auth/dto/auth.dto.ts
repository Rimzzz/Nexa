import { IsString, MinLength, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  fullName: string;

  role?: 'cashier' | 'admin';
}

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
