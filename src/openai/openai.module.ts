import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { OpenAIController } from './openai.controller';
import { UserService } from 'src/users/users.service';
import { ChatSessionService } from 'src/chat-sessions/chat-sessions.service';
import { ChatMessageService } from 'src/chat-messages/chat-messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSession } from 'src/chat-sessions/chat-session.entity';
import { ChatMessage } from 'src/chat-messages/chat-message.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatSession, ChatMessage, User])],
  controllers: [OpenAIController],
  providers: [
    OpenAIService,
    UserService,
    ChatSessionService,
    ChatMessageService,
  ],
})
export class OpenAIModule {}
