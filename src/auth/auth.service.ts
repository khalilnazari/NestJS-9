import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const EXPIRE_TIME = 20 * 1000;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(authDto: AuthDto) {
    const { email, password } = authDto;

    try {
      // check if user exist
      const userExist = await this.userRepository.findOne({ where: { email } });
      const { password: hashedPassword, ...user } = userExist;
      if (!userExist) {
        throw new UnauthorizedException('Wrong credentials used');
      }

      // check password
      const isMatch = await bcrypt.compare(password, hashedPassword);
      if (!isMatch) {
        throw new UnauthorizedException('Wrong credentials used');
      }

      // Create auth token

      const payload = {
        username: email,
        sub: `${userExist.firstName}${userExist.lastName}`,
      };

      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: process.env.jwtSecretKey,
      });

      return accessToken;

      return {
        user,
        accessToken,
      };
    } catch (error) {
      return error;
    }
  }

  logout() {
    return `This action returns all auth`;
  }

  async userTest(cookies: string) {
    try {
      return await this.jwtService.verifyAsync(cookies, {
        secret: process.env.jwtSecretKey,
      });
    } catch (error) {
      return new UnauthorizedException();
    }
  }
}
