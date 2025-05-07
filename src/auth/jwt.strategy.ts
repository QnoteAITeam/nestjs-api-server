import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IPayLoad } from 'src/commons/interfaces/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY!,
    });
  }

  handleRequest(
    err,
    user: IPayLoad | null,
    info: JWTErrorInfo,
    context: ExecutionContext,
  ) {
    if (err || !user) {
      // JWT가 만료되었을 때 info.name이 'TokenExpiredError'임
      if (info && info.name === 'TokenExpiredError') {
        //AccessToken.. 이...만료됨..
        throw new UnauthorizedException('Access token expired');
      }

      throw new UnauthorizedException('Invalid access token');
    }
    return user;
  }

  validate(payload: IPayLoad) {
    return { userId: payload.sub, username: payload.name };
  }
}

interface JWTErrorInfo {
  name: string;
  message: string;
  stack?: string;
}
