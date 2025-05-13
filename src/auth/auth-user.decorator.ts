// user.decorator.ts
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { IPayLoad } from 'src/commons/interfaces/interfaces';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request & { user: IPayLoad } = ctx
      .switchToHttp()
      .getRequest();

    if (!request.user) {
      throw new UnauthorizedException('User not found in request.');
    }
    return request.user;
  },
);
