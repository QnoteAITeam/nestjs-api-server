import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  //여기에 어떻게, email, password가 오냐?
  //기존 'local'Guard에서, 여기로 먼저 넘어오는데, Strategy = passport-local인데, body의, username, password값을 찾아옴.
  //근데, usernameField를 지금 생성자에서 'email'로 초기화 시켰기 때문에, 커스텀한 매칭이 작동해서, 아래 validate가 잘 작동함.

  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.validateUser({ email, password });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
