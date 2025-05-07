import { Injectable, OnModuleInit } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletion } from 'openai/resources/chat';
import { ChatRequestDto } from './dto/openai-request.dto';

@Injectable()
export class OpenAIService implements OnModuleInit {
  private openai: OpenAI;

  onModuleInit() {
    if (this.openai) return;
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log(process.env.OPEN_API_KEY);
  }

  async sendMessage({ messages }: ChatRequestDto): Promise<ChatCompletion> {
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
