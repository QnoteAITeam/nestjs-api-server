import {
  Controller,
  Post,
  UseGuards,
  Body,
  Req,
  UnauthorizedException,
  Headers,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request } from 'express';
import { AuthService } from './auth.service';
import axios from 'axios';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './auth-user.decorator';
import { IPayLoad } from 'src/commons/interfaces/interfaces';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('local-login')
  async localLogin(@Body() body: { email: string; password: string | null }) {
    return this.authService.getTokensByEmail({ email: body.email });
  }

  //header에다가, 'provider' : 'kakao' | 'google'
  @Post('oauth-login')
  async oauthLogin(@Req() req: Request) {
    const oauthAceessToken = req.headers['Authorization'];
    const provider = req.headers['provider'];

    if (provider == null) {
      throw new UnauthorizedException('Provider element should be offered');
    }

    if (oauthAceessToken == null) {
      throw new UnauthorizedException('Null value has been dectected');
    }

    if (provider === 'kakao') {
      try {
        const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
          headers: {
            Authorization: `Bearer ${oauthAceessToken as string}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        });

        //테스트해야함. response 형식.
        console.log(response);
      } catch (error) {
        throw new UnauthorizedException(error);
      }
    } else {
      //google..
    }
  }

  @Post('restore')
  async restore(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) throw new UnauthorizedException('Invalid Token');

    return this.authService.restoreAccessToken({ refreshToken: token });
  }

  @Post('login/test')
  localLoginTest(@Headers('Authorization') token: string | null) {
    if (token == null) throw new UnauthorizedException('Toen is went wrong');
    const accessToken = token.replace('Bearer ', '');

    try {
      this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET_KEY,
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw error;
      } else {
        throw new JsonWebTokenError('Wrong Token');
      }
    }

    return { valid: true };
  }
}
