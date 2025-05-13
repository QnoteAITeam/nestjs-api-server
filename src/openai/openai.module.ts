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
import { UserPassword } from 'src/user-passwords/user-password.entity';
import { UserPasswordService } from 'src/user-passwords/user-passwords.service';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatSession, ChatMessage]), UserModule],
  controllers: [OpenAIController],
  providers: [OpenAIService, ChatSessionService, ChatMessageService],
})
export class OpenAIModule {}
