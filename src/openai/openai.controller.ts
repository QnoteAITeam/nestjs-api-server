import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  PreconditionFailedException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { OpenAIService } from './openai.service';
import {
  SendMessageDto,
  ResponseMessageDto,
  SendMessageRequestDto,
} from './dto/send-message.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/auth-user.decorator';
import { IPayLoad } from 'src/commons/interfaces/interfaces';
import { UserService } from 'src/users/users.service';
import { ChatSessionService } from 'src/chat-sessions/chat-sessions.service';
import { ChatMessageService } from 'src/chat-messages/chat-messages.service';
import { AIRequestMessage } from './dto/openai-request.dto';
import { ChatCompletion } from 'openai/resources/chat';
import { ChatSession } from 'src/chat-sessions/chat-session.entity';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import {
  GetDiaryMetaDataByContentDto,
  GetDiaryMetaDataByContentRequestDto,
} from './dto/get-diary-metadata.dto';
import {
  GetSummaryByContentDto,
  GetSummaryByContentRequestDto,
} from './dto/get-summary.dto';
import { GetPredictUserAnswerMostSessionDto } from './dto/get-predict-most-session.dto';


@Controller('openai')
export class OpenAIController {
  constructor(
    private readonly openAiService: OpenAIService,
    private readonly userService: UserService,
    private readonly chatSessionService: ChatSessionService,
    private readonly chatMessageService: ChatMessageService,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'AI에게 성공적으로 요청하여, 응답받았습니다.',
    type: SendMessageDto,
  })
  @ApiOperation({ summary: '최근 채팅 세션에서 AI에게 요청 보내기' })
  @ApiBody({ type: SendMessageRequestDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('send-message')
  @HttpCode(201)
  async sendMessage(
    @User() payload: IPayLoad,
    @Body() body: SendMessageRequestDto,
  ): Promise<SendMessageDto> {
    // 유저의 최근 세션을 찾아서, 최근 세션의 메세지를 다 합쳐서 api쿼리.
    console.log(payload.sub);
    const user = await this.userService.findById({ id: payload.sub });
    if (!user)
      throw new UnauthorizedException(
        'OpenAI Controller 30line Issue.. this should not be occured',
      );

    console.log(user);

    const session = await this.chatSessionService.findMostRecentByUser({
      user,
    });

    console.log(session);

    if (!session)
      throw new NotFoundException('There is no session in this account');

    const messages = session.messages;
    const messageList: AIRequestMessage[] = [];

    messages.forEach((value) => {
      messageList.push({ role: value.role, content: value.text });
    });
    messageList.push({ role: 'user', content: body.message });

    const result: ChatCompletion = await this.openAiService.sendMessage({
      messages: messageList,
    });

    const response = result.choices[0].message;

    console.log(response);

    await this.chatMessageService.createMessage({
      session,
      text: body.message,
      role: 'user',
    });

    if (response.content == null) {
      throw new Error("AI doesn't answered");
    }

    await this.chatMessageService.createMessage({
      session,
      text: response.content,
      role: 'assistant',
    });

    console.log(JSON.parse(response.content));

    const object = JSON.parse(response.content) as ResponseMessageDto;

    return {
      role: 'assistant',
      state: object.asking == 1 ? 'asking' : 'done',
      // message : object.message <<-- 이걸로 했어야 하는데, 이미 플러터에서 파싱해버림..
      message: response.content,
    };
  }

  @ApiResponse({
    status: 201,
    description: '일기 내용에 대한 구조가 성공적으로 생성됨.',
    type: GetDiaryMetaDataByContentDto,
  })
  @ApiOperation({ summary: '일기 내용 생성 API' })
  @ApiBody({ type: GetDiaryMetaDataByContentRequestDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('metadata')
  async getDiaryMetaDataByContent(
    @Body() body: GetDiaryMetaDataByContentRequestDto,
  ) {
    return this.openAiService.getDiaryMetaDataByContent(body.content);
  }

  @ApiResponse({
    status: 201,
    description: '일기에 대한 내용이 성공적으로 요약 되었습니다.',
    type: GetSummaryByContentDto,
  })
  @ApiOperation({ summary: '일기에 대한 내용 요약 API' })
  @ApiBody({ type: GetSummaryByContentRequestDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('summary/content')
  async getSummaryByContent(@Body() body: GetSummaryByContentRequestDto) {
    return this.openAiService.getDiarySummaryByContent(body.content);
  }

  @ApiResponse({
    status: 201,
    description:
      '최근 세션에 대한 예상 유저의 응답을 성공적으로 생성 했습니다.',
    type: GetPredictUserAnswerMostSessionDto,
  })
  @ApiOperation({
    summary: '최근 세션에 대한 예상 유저의 응답 생성',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('predict/recent')
  async getPredictUserAnswerMostSession(@User() payload: IPayLoad) {
    const user = await this.userService.findById({ id: payload.sub });

    if (user === null)
      throw new UnauthorizedException(
        '사용자가 존재하지 않거나 삭제된 계정입니다.',
      );

    const chatSession = await this.chatSessionService.findMostRecentByUser({
      user,
    });

    if (chatSession === null)
      throw new PreconditionFailedException(
        'ChatSession 을 미리 만들어 놓지 않음.',
      );

    return this.openAiService.predictUserAnswerBySession({
      chatSession: (await this.chatSessionService.findByIdWithRelations({
        id: chatSession.id,
        relations: ['messages'],
      })) as ChatSession,
    });
  }

  @ApiResponse({
    status: 201,
    description:
      '특정 세션에 대한 예상 유저의 응답을 성공적으로 생성 했습니다.',
    type: GetPredictUserAnswerMostSessionDto,
  })
  @ApiOperation({
    summary: '특정 세션에 대한 예상 유저 응답 생성',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: '예측하려는 대상 ChatSession의 ID',
    example: 123,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('predict/:id')
  async getPredictUserAnswerByChatSessionId(
    @User() payload: IPayLoad,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = await this.userService.findById({ id: payload.sub });

    if (user === null)
      throw new UnauthorizedException(
        '사용자가 존재하지 않거나 삭제된 계정입니다.',
      );

    const chatSession = await this.chatSessionService.findByIdWithRelations({
      id,
      relations: ['messages'],
    });

    if (chatSession === null)
      throw new PreconditionFailedException(
        'ChatSession 을 미리 만들어 놓지 않음.',
      );

    return this.openAiService.predictUserAnswerBySession({ chatSession });
  }
}
