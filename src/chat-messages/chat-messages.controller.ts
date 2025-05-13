import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  UseGuards,
  ParseIntPipe,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ChatMessageService } from './chat-messages.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChatMessage } from './chat-message.entity';
import { ChatSessionService } from 'src/chat-sessions/chat-sessions.service';
import { IPayLoad } from 'src/commons/interfaces/interfaces';
import { UserService } from 'src/users/users.service';
import { User } from 'src/auth/auth-user.decorator';

@Controller('chat-messages')
export class ChatMessageController {
  constructor(
    private readonly chatMessagesService: ChatMessageService,
    private readonly chatSessionsService: ChatSessionService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('session/:sessionId')
  async getAllMessagesBySession(
    @Param('sessionId', ParseIntPipe) sessionId: number,
  ): Promise<ChatMessage[]> {
    const session = await this.chatSessionsService.findById({ id: sessionId });
    if (!session) throw new NotFoundException('Session not found');

    return this.chatMessagesService.findAllBySession({ session });
  }

  // 최근 N개 메시지 조회
  @Get('session/:sessionId/recent')
  async getRecentMessagesBySession(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Query('count', ParseIntPipe) count: number = 10,
  ): Promise<ChatMessage[]> {
    const session = await this.chatSessionsService.findById({ id: sessionId });
    if (!session) throw new NotFoundException('Session not found');

    return this.chatMessagesService.findRecentMessages({
      session,
      count,
    });
  }

  //마지막 세션에서, mesasge count개 조회
  @UseGuards(JwtAuthGuard)
  @Get('my/recent-messages')
  async getRecentMessagesFromLatestSession(
    @User() payload: IPayLoad,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<ChatMessage[]> {
    const user = await this.userService.findById({ id: payload.sub });

    if (user == null)
      throw new NotFoundException('Jwt Token is something went...');

    const latestSession = await this.chatSessionsService.findMostRecentByUser({
      user,
    });

    if (!latestSession)
      throw new NotFoundException('There are no sessions from this user');

    return this.chatMessagesService.findRecentMessages({
      session: latestSession,
      count: limit,
    });
  }

  //마지막 세션에서 모든 메세지 반환
  @UseGuards(JwtAuthGuard)
  @Get('my/messages')
  async getAllMessagesFromLatestSession(
    @User() payload: IPayLoad,
  ): Promise<ChatMessage[]> {
    const user = await this.userService.findById({ id: payload.sub });

    if (user == null)
      throw new UnauthorizedException('Jwt Token is something went...');

    const latestSession = await this.chatSessionsService.findMostRecentByUser({
      user,
    });

    if (!latestSession)
      throw new NotFoundException('There are no sessions from this user');

    return this.chatMessagesService.findAllBySession({
      session: latestSession,
    });
  }
}
