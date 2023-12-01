import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/create-auth.dto';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async login(
    @Body() createAuthDto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(createAuthDto);
    const res = await this.authService.login(createAuthDto);

    response.cookie('jwt', res.accessToken, { httpOnly: true });

    return res;
  }

  @Post('/logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    throw new UnauthorizedException();
  }

  @Get('/refereshToken')
  async refreshToken(
    @Param('id') id: string,
    @Body() createAuthDto: AuthDto,
    @Req() request: Request,
  ) {
    const cookies = await request.cookies['jwt'];
    return await this.authService.userTest(cookies);
  }
}
