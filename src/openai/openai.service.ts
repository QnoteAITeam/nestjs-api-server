import { Injectable, OnModuleInit } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletion } from 'openai/resources/chat';
import { AIRequestDto } from './dto/openai-request.dto';
import { ChatSessionService } from 'src/chat-sessions/chat-sessions.service';
import { ChatMessageService } from 'src/chat-messages/chat-messages.service';

@Injectable()
export class OpenAIService implements OnModuleInit {
  private openai: OpenAI;

  constructor(
    private readonly chatSessionService: ChatSessionService,
    private readonly chatMessageService: ChatMessageService,
  ) {}

  onModuleInit() {
    if (this.openai) return;
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log(process.env.OPEN_API_KEY);
  }

  async sendMessageOnSession({
    message,
    sessionId,
  }: {
    message: string;
    sessionId: number;
  }) {
    // 개발 할 필요가 없는 서비스.
    // 맨 최근 세션에서만 대화할것임..
  }

  async sendMessage({ messages }: AIRequestDto): Promise<ChatCompletion> {
    try {
      const response: ChatCompletion =
        await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: messages,
        });

      return response;
    } catch (error) {
      console.error('OpenAI API 에러:', error);
      throw new Error('OpenAI API 요청 실패');
    }
  }
}
