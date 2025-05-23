import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletion } from 'openai/resources/chat';
import { AIRequestDto, AIRequestMessage } from './dto/openai-request.dto';
import { ChatSessionService } from 'src/chat-sessions/chat-sessions.service';
import { ChatMessageService } from 'src/chat-messages/chat-messages.service';

import * as Shared from 'openai/resources/shared';
import { summaryAssistantThird } from 'src/commons/constants/prompts';
import { WrittenDiary } from './dto/get-diary.dto';
import { predict_prompt } from 'src/commons/constants/predict-prompts';
import { ChatSession } from 'src/chat-sessions/chat-session.entity';
import { SummaryDto } from './dto/summary.dto';
import { PredictDto } from './dto/predict.dto';
import { summary_model } from 'src/commons/constants/summary-prompts';

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


  async getDiaryMetaDataByContent(content: string): Promise<WrittenDiary> {
    const model: Shared.ChatModel = 'gpt-3.5-turbo';

    const messages: AIRequestMessage[] = [
      { role: 'system', content: summaryAssistantThird },
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

  async predictUserAnswerBySession({
    chatSession,
  }: {
    chatSession: ChatSession;
  }): Promise<PredictDto> {
    const model: Shared.ChatModel = 'gpt-3.5-turbo';

    if (chatSession.messages === undefined)
      throw new InternalServerErrorException(
        '서버 측 에서, chatSession에 대한 정보를 relations 하지 않았습니다.',
      );

    //세션에는 기본 시스템 메세지가 존재하므로 하나 뺍니다.
    const [systemChat, ...rest] = chatSession.messages;

    const messages: AIRequestMessage[] = [
      { role: 'system', content: predict_prompt },
      { role: 'user', content: JSON.stringify(rest) },
    ];

    try {
      const apiResponse: ChatCompletion =
        await this.openai.chat.completions.create({
          model: model,
          messages,
        });

      const response = apiResponse.choices[0].message;
      const parsing = JSON.parse(response.content!) as { responses: string[] };

      return { predicts: parsing.responses };
    } catch (error) {
      console.error('OpenAI API 에러:', error);
      throw new Error('OpenAI API 요청 실패');
    }
  }

  async getDiarySummaryByContent(content: string): Promise<SummaryDto> {
    const model: Shared.ChatModel = 'gpt-3.5-turbo';

    const messages: AIRequestMessage[] = [
      { role: 'system', content: summary_model },
      { role: 'user', content: content },
    ];

    try {
      const apiResponse: ChatCompletion =
        await this.openai.chat.completions.create({
          model: model,
          messages,
        });

      const response = apiResponse.choices[0].message;
      const parsing = JSON.parse(response.content!) as SummaryDto;

      return parsing;
    } catch (error) {
      console.error('OpenAI API 에러:', error);
      throw new Error('OpenAI API 요청 실패');
    }
  }
}
