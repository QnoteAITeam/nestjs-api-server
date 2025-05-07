// src/user/user.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() body: { username: string; email: string }) {
    return this.userService.createUser(body.username, body.email);
  }

  @Get()
  async getAll() {
    return this.userService.getAllUsers();
  }
}
