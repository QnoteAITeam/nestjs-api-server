import {
  Controller,
  Post,
  UseGuards,
  Body,
  Req,
  UnauthorizedException,
  Headers,
  HttpCode,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request } from 'express';
import { AuthService } from './auth.service';
import axios from 'axios';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './auth-user.decorator';
import { IPayLoad } from 'src/commons/interfaces/interfaces';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { LocalLoginDto, LocalLoginRequestDto } from './dto/local-login.dto';
import { RestoreDto } from './dto/restore.dto';
import { LocalLoginTestDto } from './dto/local-login-test.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiResponse({
    status: 200,
    description: '앱 자체 로그인 서비스에 로그인 성공',
    type: LocalLoginDto,
  })
  @ApiOperation({ summary: '앱 자체 로그인 서비스에 로그인' })
  @ApiBody({ type: LocalLoginRequestDto })
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('local-login')
  async localLogin(@Body() body: LocalLoginRequestDto) {
    return this.authService.getTokensByEmail({ email: body.email });
  }

  @ApiResponse({
    status: 501,
    description: '아직 구현되지 않은 API입니다.',
    type: LocalLoginDto,
  })
  @ApiOperation({ summary: '미구현 API' })
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

  @ApiResponse({
    status: 200,
    description: 'refreshToken을 이용한, accessToken restore 작업 성공',
    type: RestoreDto,
  })
  // @ApiHeader({
  //   name: 'Authorization',
  //   description: 'refreshToken을 넣어주세요.',
  //   required: true,
  // })
  @ApiOperation({ summary: 'refreshToken을 이용한 accessToken Restore API' })
  @ApiBearerAuth('access-token') // 사실 access token이 아니라, refreshToken인데 그냥 귀찮았습니다.
  @Post('restore')
  async restore(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) throw new UnauthorizedException('Invalid Token');

    return this.authService.restoreAccessToken({ refreshToken: token });
  }

  @ApiResponse({
    status: 200,
    description: 'accessToken이 정삼임을 확인',
    type: LocalLoginTestDto,
  })
  @ApiOperation({ summary: 'accessToken 유효성 검증 API' })
  @ApiHeader({
    name: 'Authorization',
    description: 'accessToken을 넣어주세요.',
    required: true,
  })
  @Post('login/test')
  localLoginTest(@Headers('Authorization') token: string | null) {
    if (token == null)
      throw new UnauthorizedException('AccessToken이 없습니다.');

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
