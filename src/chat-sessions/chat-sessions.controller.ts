import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  NotFoundException,
  Body,
  ParseIntPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ChatSessionService } from './chat-sessions.service';
import { UserService } from 'src/users/users.service';
import { ChatSession } from './chat-session.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IPayLoad } from 'src/commons/interfaces/interfaces';
import { User } from 'src/auth/auth-user.decorator';

@Controller('sessions')
export class ChatSessionController {
  constructor(
    private readonly chatSessionsService: ChatSessionService,
    private readonly usersService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllSessions(@User() payload: IPayLoad): Promise<ChatSession[]> {
    const user = await this.usersService.findById({ id: payload.sub });

    //JwtAuthGuard를 통과한 것이라, user는 무조건 있을 것으로 예상된다.
    if (!user) throw new NotFoundException('User not found');

    return this.chatSessionsService.findAllByUser({ user });
  }

  // 유저의 최근 N개의 세션
  @UseGuards(JwtAuthGuard)
  @Get('recent')
  async getRecentSessions(
    @Query('count', ParseIntPipe) count: number = 5,
    @User() payload: IPayLoad,
  ): Promise<ChatSession[]> {
    const user = await this.usersService.findById({ id: payload.sub });

    //JwtAuthGuard를 통과한 것이라, user는 무조건 있을 것으로 예상된다.
    if (!user) throw new NotFoundException('User not found');

    return this.chatSessionsService.findRecentSessionsByUser({
      user,
      count,
    });
  }

  // 유저의 가장 최근 세션
  @UseGuards(JwtAuthGuard)
  @Get('latest')
  async getMostRecentSession(@User() payload: IPayLoad): Promise<ChatSession> {
    const user = await this.usersService.findById({ id: payload.sub });
    if (!user) throw new NotFoundException('User not found');

    const session = await this.chatSessionsService.findMostRecentByUser({
      user,
    });
    if (!session) throw new NotFoundException('No sessions found');

    return session;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createNewSession(@User() payload: IPayLoad) {
    const user = await this.usersService.findById({ id: payload.sub });
    if (user == null)
      throw new UnauthorizedException('User is Not Exist in DB');

    return this.chatSessionsService.createSessionForUser({ user });
  }
}
