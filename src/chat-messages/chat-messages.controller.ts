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
  ForbiddenException,
} from '@nestjs/common';
import { ChatMessageService } from './chat-messages.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChatMessage } from './chat-message.entity';
import { ChatSessionService } from 'src/chat-sessions/chat-sessions.service';
import { IPayLoad } from 'src/commons/interfaces/interfaces';
import { UserService } from 'src/users/users.service';
import { User } from 'src/auth/auth-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatMessageDto } from './dto/chat-message.dto';
import { plainToInstance } from 'class-transformer';

@Controller('chat-messages')
export class ChatMessageController {
  constructor(
    private readonly chatMessagesService: ChatMessageService,
    private readonly chatSessionsService: ChatSessionService,
    private readonly userService: UserService,
  ) {}

  @ApiResponse({
    status: 200,
    description: '특정 세션의 모든 메세지를 가지고 옵니다.',
    type: ChatMessageDto,
    isArray: true,
  })
  @ApiOperation({ summary: '특정 세션의 모든 메세지를 조회' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('session/:sessionId')
  async getAllMessagesBySession(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @User() payload: IPayLoad,
  ): Promise<ChatMessageDto[]> {
    const session = await this.chatSessionsService.findByIdWithRelations({
      id: sessionId,
      relations: ['user'],
    });

    if (!session) throw new NotFoundException('Session not found');

    if (session.user.id !== payload.sub)
      throw new ForbiddenException('이 세션에 접근 할 권한이 없습니다.');

    return plainToInstance(
      ChatMessageDto,
      await this.chatMessagesService.findAllBySession({ session }),
      { excludeExtraneousValues: true },
    );
  }

  @ApiResponse({
    status: 200,
    description: '특정 세션의 최근 N개의 메세지 조회',
    type: ChatMessageDto,
    isArray: true,
  })
  @ApiOperation({ summary: '특정 세션의 최근 N개의 메세지를 조회' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('session/:sessionId/recent')
  async getRecentMessagesBySession(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Query('count', ParseIntPipe) count: number = 10,
    @User() payload: IPayLoad,
  ): Promise<ChatMessageDto[]> {
    const session = await this.chatSessionsService.findByIdWithRelations({
      id: sessionId,
      relations: ['user'],
    });

    if (!session) throw new NotFoundException('Session not found');

    if (session.user.id !== payload.sub)
      throw new ForbiddenException('이 세션에 접근 할 권한이 없습니다.');

    return plainToInstance(
      ChatMessageDto,
      await this.chatMessagesService.findRecentMessages({
        session,
        count,
      }),
      { excludeExtraneousValues: true },
    );
  }

  @ApiResponse({
    status: 200,
    description: '마지막 세션에서, N개의 메세지 조회에 성공했습니다.',
    type: ChatMessageDto,
    isArray: true,
  })
  @ApiOperation({ summary: '마지막 세션에서 N개의 메세지 조회' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('my/recent-messages')
  async getRecentMessagesFromLatestSession(
    @User() payload: IPayLoad,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<ChatMessageDto[]> {
    const user = await this.userService.findById({ id: payload.sub });

    if (user == null)
      throw new NotFoundException('Jwt Token is something went...');

    const latestSession = await this.chatSessionsService.findMostRecentByUser({
      user,
    });

    if (!latestSession)
      throw new NotFoundException('There are no sessions from this user');

    return plainToInstance(
      ChatMessageDto,
      await this.chatMessagesService.findRecentMessages({
        session: latestSession,
        count: limit,
      }),
      { excludeExtraneousValues: true },
    );
  }

  @ApiResponse({
    status: 200,
    description: '마지막 세션에서, 모든 메세지 조회에 성공했습니다.',
    type: ChatMessageDto,
    isArray: true,
  })
  @ApiOperation({ summary: '마지막 세션에서 모든 메세지 조회' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('my/messages')
  async getAllMessagesFromLatestSession(
    @User() payload: IPayLoad,
  ): Promise<ChatMessageDto[]> {
    const user = await this.userService.findById({ id: payload.sub });

    if (user == null)
      throw new UnauthorizedException('Jwt Token is something went...');

    const latestSession = await this.chatSessionsService.findMostRecentByUser({
      user,
    });

    if (!latestSession)
      throw new NotFoundException('There are no sessions from this user');

    return plainToInstance(
      ChatMessageDto,
      await this.chatMessagesService.findAllBySession({
        session: latestSession,
      }),
      { excludeExtraneousValues: true },
    );
  }
}
