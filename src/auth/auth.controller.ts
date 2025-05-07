import {
  Controller,
  Post,
  UseGuards,
  Body,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { constrainedMemory } from 'process';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { IPayLoad } from 'src/commons/interfaces/interfaces';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('local/login')
  async localLogin(@Body() body: { email: string; password: string | null }) {
    return this.authService.getTokensByEmail({ email: body.email });
  }

  @Post('oauth/login')
  async oauthLogin(@Req() req: Request) {}

  @Post('restore')
  async restore(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) throw new UnauthorizedException('Invalid Token');

    return this.authService.restoreAccessToken({ refreshToken: token });
  }
}
