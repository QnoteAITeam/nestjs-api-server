import { Body, Controller, Get, Post } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { ChatRequestDto } from './dto/openai-request.dto';

@Controller('openai')
export class OpenAIController {
  constructor(private readonly openAiService: OpenAIService) {}

  @Post('sendMessages')
  async sendMessages(@Body() chatRequest: ChatRequestDto): Promise<string> {
    const response = await this.openAiService.sendMessage(chatRequest);
    return JSON.stringify(response);
  }

  @Get('hello')
  getHello(): string {
    return 'hello';
  }
}
