import { Injectable, OnModuleInit } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletion } from 'openai/resources/chat';
import { AIRequestDto, AIRequestMessage } from './dto/openai-request.dto';
import { ChatSessionService } from 'src/chat-sessions/chat-sessions.service';
import { ChatMessageService } from 'src/chat-messages/chat-messages.service';

import * as Shared from 'openai/resources/shared';
import { summaryAssistant } from 'src/commons/constants/prompts';
import { WrittenDiary } from './dto/get-diary.dto';

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
    const model: Shared.ChatModel = 'gpt-3.5-turbo';

    try {
      const response: ChatCompletion =
        await this.openai.chat.completions.create({
          model: model,
          messages: messages,
        });

      return response;
    } catch (error) {
      console.error('OpenAI API 에러:', error);
      throw new Error('OpenAI API 요청 실패');
    }
  }

  async getDiaryInfoByContent(content: string): Promise<WrittenDiary> {
    const model: Shared.ChatModel = 'gpt-3.5-turbo';

    const messages: AIRequestMessage[] = [
      { role: 'system', content: summaryAssistant },
      { role: 'user', content: content },
    ];

    try {
      const apiResponse: ChatCompletion =
        await this.openai.chat.completions.create({
          model: model,
          messages,
        });

      const response = apiResponse.choices[0].message;
      const parsing = JSON.parse(response.content!) as WrittenDiary;

      return parsing;
    } catch (error) {
      console.error('OpenAI API 에러:', error);
      throw new Error('OpenAI API 요청 실패');
    }
  }
}
