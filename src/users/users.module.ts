import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserPasswordService } from 'src/user-passwords/user-passwords.service';
import { UserPassword } from 'src/user-passwords/user-password.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserPassword]), //
  ],

  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, UserPasswordService],
})
export class UserModule {}
