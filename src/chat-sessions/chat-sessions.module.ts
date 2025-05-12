import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSessionController } from './chat-sessions.controller';
import { UserService } from 'src/users/users.service';
import { ChatSessionService } from './chat-sessions.service';
import { User } from 'src/users/user.entity';
import { ChatSession } from './chat-session.entity';
import { ChatMessage } from 'src/chat-messages/chat-message.entity';
import { ChatMessageService } from 'src/chat-messages/chat-messages.service';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatSession, ChatMessage]), UserModule],
  controllers: [ChatSessionController],
  providers: [ChatSessionService, ChatMessageService],
})
export class ChatSessionModule {}
