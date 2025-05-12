import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSessionController } from './chat-sessions.controller';
import { UserService } from 'src/users/users.service';
import { ChatSessionService } from './chat-sessions.service';
import { User } from 'src/users/user.entity';
import { ChatSession } from './chat-session.entity';
import { ChatMessage } from 'src/chat-messages/chat-message.entity';
import { ChatMessageService } from 'src/chat-messages/chat-messages.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, ChatSession, ChatMessage])],
  controllers: [ChatSessionController],
  providers: [UserService, ChatSessionService, ChatMessageService],
})
export class ChatSessionModule {}
