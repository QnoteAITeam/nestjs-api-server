import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  PreconditionFailedException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { SendMessageDto, ResponseMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/auth-user.decorator';
import { IPayLoad } from 'src/commons/interfaces/interfaces';
import { UserService } from 'src/users/users.service';
import { ChatSessionService } from 'src/chat-sessions/chat-sessions.service';
import { ChatMessageService } from 'src/chat-messages/chat-messages.service';
import { AIRequestMessage } from './dto/openai-request.dto';
import { ChatCompletion } from 'openai/resources/chat';
import { ChatSession } from 'src/chat-sessions/chat-session.entity';

@Controller('openai')
export class OpenAIController {
  constructor(
    private readonly openAiService: OpenAIService,
    private readonly userService: UserService,
    private readonly chatSessionService: ChatSessionService,
    private readonly chatMessageService: ChatMessageService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('send-message')
  async sendMessage(
    @User() payload: IPayLoad,
    @Body() body: { message: string },
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
      message: response.content,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('summary')
  async getSummaryContent(@Body() body: { content: string }) {
    return this.openAiService.getDiaryInfoByContent(body.content);
  }

  @UseGuards(JwtAuthGuard)
  @Post('summary/content')
  async getSummaryByContent(@Body() body: { content: string }) {
    return this.openAiService.getDiarySummaryByContent(body.content);
  }

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
