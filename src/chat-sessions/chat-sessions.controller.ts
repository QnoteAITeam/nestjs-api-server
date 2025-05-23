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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { ChatSessionDto } from './dto/chat-session.dto';

@Controller('sessions')
export class ChatSessionController {
  constructor(
    private readonly chatSessionsService: ChatSessionService,
    private readonly usersService: UserService,
  ) {}

  @ApiResponse({
    status: 200,
    description: '특정 유저의 모든 채팅 세션 조회',
    type: ChatSessionDto,
    isArray: true,
  })
  @ApiOperation({ summary: '특정 유저의 모든 채팅 세션 조회' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllSessions(@User() payload: IPayLoad): Promise<ChatSessionDto[]> {
    const user = await this.usersService.findById({ id: payload.sub });

    //JwtAuthGuard를 통과한 것이라, user는 무조건 있을 것으로 예상된다.
    if (!user) throw new NotFoundException('User not found');

    return plainToInstance(
      ChatSessionDto,
      await this.chatSessionsService.findAllByUser({ user }),
      { excludeExtraneousValues: true },
    );
  }

  // 유저의 최근 N개의 세션
  @ApiResponse({
    status: 200,
    description: '특정 유저의 성공적인 최근 N개의 채팅 세션 조회',
    type: ChatSessionDto,
    isArray: true,
  })
  @ApiOperation({ summary: '특정 유저의 성공적인 최근 N개의 채팅 세션 조회' })
  @ApiBearerAuth('access-token')
  @ApiQuery({
    name: 'count',
    required: false,
    type: Number,
    description: '최근 조회할 세션 갯수 기본값 : 5',
    default: 5,
  })
  @UseGuards(JwtAuthGuard)
  @Get('recent')
  async getRecentSessions(
    @Query('count', ParseIntPipe) count: number = 5,
    @User() payload: IPayLoad,
  ): Promise<ChatSessionDto[]> {
    const user = await this.usersService.findById({ id: payload.sub });

    //JwtAuthGuard를 통과한 것이라, user는 무조건 있을 것으로 예상된다.
    if (!user) throw new NotFoundException('User not found');

    return plainToInstance(
      ChatSessionDto,
      await this.chatSessionsService.findRecentSessionsByUser({
        user,
        count,
      }),
      { excludeExtraneousValues: true },
    );
  }

  @ApiResponse({
    status: 200,
    description: '가장 최근 세션 조회',
    type: ChatSessionDto,
  })
  @ApiOperation({ summary: '가장 최근 세션 조회' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('latest')
  async getMostRecentSession(
    @User() payload: IPayLoad,
  ): Promise<ChatSessionDto> {
    const user = await this.usersService.findById({ id: payload.sub });
    if (!user) throw new NotFoundException('User not found');

    const session = await this.chatSessionsService.findMostRecentByUser({
      user,
    });
    if (!session) throw new NotFoundException('No sessions found');

    return plainToInstance(ChatSessionDto, session, {
      excludeExtraneousValues: true,
    });
  }

  @ApiResponse({
    status: 201,
    description: '성공적인 세션 생성',
    type: ChatSessionDto,
  })
  @ApiOperation({ summary: '세션 생성 API' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  async createNewSession(@User() payload: IPayLoad) {
    const user = await this.usersService.findById({ id: payload.sub });
    if (user == null)
      throw new UnauthorizedException('User is Not Exist in DB');

    return plainToInstance(
      ChatSessionDto,
      await this.chatSessionsService.createSessionForUser({ user }),
      { excludeExtraneousValues: true },
    );
  }
}
