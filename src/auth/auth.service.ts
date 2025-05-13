// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/users.service';

import * as bcrypt from 'bcryptjs';
import {
  IEmail,
  IEmailandPassword,
  IID,
  IPayLoad,
  ITokens,
} from 'src/commons/interfaces/interfaces';
import { User } from 'src/users/user.entity';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UserPasswordService } from 'src/user-passwords/user-passwords.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userPasswordService: UserPasswordService,
    private readonly jwtService: JwtService,
  ) {}

  // 특수함 때문에, 객체로 받지 않음.
  async restoreAccessToken({ refreshToken }: IrestoreAccessToken): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    if (refreshToken == null) throw new UnauthorizedException('Invalid token');

    try {
      const payload: IPayLoad = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET_KEY!,
      });

      const tokens = await this.getTokensById({ id: payload.sub });
      return tokens;
    } catch (err) {
      if (
        err instanceof TokenExpiredError &&
        err.name === 'TokenExpiredError'
      ) {
        throw new UnauthorizedException('restore Token expired');
      }

      throw new UnauthorizedException('Invalid token');
    }
  }

  async getHashingPassword({ password }: IPassword): Promise<string | null> {
    return await bcrypt.hash(
      password,
      Number.parseInt(process.env.SALT_ROUNDS!),
    );
  }

  async validateUser({ email, password }: IValidateUser): Promise<User | null> {
    //같은 이메일을 가지고 있는 유저를 db에서 탐색합니다.
    const user = await this.userService.findByEmail({ email });
    if (user == null) return null;

    const isValid = await this.userPasswordService.matchPasswordByUser({
      user,
      rawPassword: password,
    });

    if (isValid) return user;
    return null;
  }

  async getTokensByEmail({ email }: IEmail) {
    const user = (await this.userService.findByEmail({ email })) as User;

    const payload: IPayLoad = {
      sub: user.id,
      name: user.username,
      provider: user.provider,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY!,
      expiresIn: '3h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY!,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async getTokensById({ id }: IID) {
    const user = (await this.userService.findById({ id })) as User;

    const payload: IPayLoad = {
      sub: user.id,
      name: user.username,
      provider: user.provider,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY!,
      expiresIn: '3h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY!,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  //LocalStrategy를 통과했으므로, 그냥 AccessToken 발급만 해주면 된다.
  async localLogin({ email, password }: IEmailandPassword): Promise<ITokens> {
    return await this.getTokensByEmail({ email });
  }

  async restoreLogin() {}

  async oauthLogin() {}
}

interface IValidateUser {
  email: string;
  password: string;
}

interface IPassword {
  password: string;
}
