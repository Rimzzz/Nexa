import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../../repositories/users.repository';
import { CreateUserDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<any> {
    const { username, email, password, fullName, role } = createUserDto;

    const existingUser = await this.usersRepository.findByUsername(username);
    if (existingUser) {
      throw new ConflictException('Username sudah digunakan');
    }

    const existingEmail = await this.usersRepository.findByEmail(email);
    if (existingEmail) {
      throw new ConflictException('Email sudah digunakan');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      fullName,
      role: role || 'cashier',
    };

    const user = await this.usersRepository.create(newUser);
    const { password: _, ...result } = user;
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
        email: user.email,
        fullName: user.full_name,
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
