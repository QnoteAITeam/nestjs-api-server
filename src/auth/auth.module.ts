import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { UserModule } from '../users/users.module';
import { UserService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserPasswordService } from 'src/user-passwords/user-passwords.service';
import { UserPassword } from 'src/user-passwords/user-password.entity';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '3h' },
    }),

    //UserRepository를 사용하려면, 등록해주어야 한다.
    TypeOrmModule.forFeature([User, UserPassword]),

    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    JwtStrategy,
    UserPasswordService,
  ],
  exports: [JwtModule],
})
export class AuthModule {}
