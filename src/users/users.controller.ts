// src/user/user.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './users.service';
import { User as Payload } from 'src/auth/auth-user.decorator';
import { IPayLoad } from 'src/commons/interfaces/interfaces';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get('my')
  async get(@Payload() payload: IPayLoad): Promise<User | null> {
    return this.userService.findById({ id: payload.sub });
  }

  @Post('signup-local')
  async signUpLocal(@Body() body: { email: string; password: string }) {
    return this.userService.createUser(body.email, body.password);
  }

  @Post('')
  async createUser(
    @Body() body: { email: string; password: string; username: string },
  ) {
    return this.userService.createUserWithName(
      body.email,
      body.password,
      body.username,
    );
  }
}
