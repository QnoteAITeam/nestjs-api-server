// src/user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './users.service';
import { User as Payload } from 'src/auth/auth-user.decorator';
import { IPayLoad } from 'src/commons/interfaces/interfaces';
import { User } from './user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto, CreateUserRequestDto } from './dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { SignUpLocalRequestDto } from './dto/signup-local.dto';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: 200,
    description: '모든 유저의 정보 요청, 디버깅용 endpoint',
    type: UserDto,
    isArray: true,
  })
  @ApiOperation({ summary: '모든 정보의 요청, 나중에 삭제할 API' })
  @Get()
  async getAll(): Promise<UserDto[]> {
    const UserArray = await this.userService.getAllUsers();

    return plainToInstance(UserDto, UserArray, {
      excludeExtraneousValues: true,
    });
  }

  @ApiResponse({
    status: 200,
    description: '성공적인, 본인 정보 요청',
    type: UserDto,
  })
  @ApiOperation({ summary: '본인 정보 요청' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyProfile(@Payload() payload: IPayLoad): Promise<UserDto> {
    const user = await this.userService.findById({ id: payload.sub });

    if (user == null)
      throw new NotFoundException(`There is no user id :${payload.sub}`);

    return plainToInstance(UserDto, user, { excludeExtraneousValues: true });
  }

  @ApiResponse({
    status: 200,
    description: '이메일과 패스워드로 계정 생성 성공',
    type: UserDto,
  })
  @ApiOperation({ summary: '이메일과 패스워드로 계정 생성' })
  @ApiBody({ type: SignUpLocalRequestDto })
  @Post('signup-local')
  async signUpLocal(@Body() body: { email: string; password: string }) {
    return this.userService.createUser(body.email, body.password);
  }

  @Post('')
  @ApiResponse({
    status: 201,
    description: 'User Successfully Created',
    type: CreateUserDto,
  })
  @ApiOperation({ summary: '이메일과 패스워드 유저이름으로 계정 생성' })
  @ApiBody({ type: CreateUserRequestDto })
  async createUser(
    @Body() body: { email: string; password: string; username: string },
  ): Promise<CreateUserDto> {
    const user = await this.userService.createUserWithName(
      body.email,
      body.password,
      body.username,
    );

    return plainToInstance(CreateUserDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
