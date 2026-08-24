import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../../repositories/users.repository';
import { CreateUserDto, LoginDto } from './dto/auth.dto';
import { type NewUser } from '../../db/schema';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<any> {
    const existingUser = await this.usersRepository.findByUsername(createUserDto.username);

    if (existingUser) {
      throw new Error('Username sudah digunakan');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser: NewUser = {
      username: createUserDto.username,
      password: hashedPassword,
      fullName: createUserDto.fullName,
      role: createUserDto.role || 'cashier',
    };

    const user = await this.usersRepository.create(newUser);
    const { password, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.usersRepository.findByUsername(loginDto.username);

    if (!user) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async getProfile(userId: number): Promise<any> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan');
    }

    const { password, ...result } = user;
    return result;
  }
}
