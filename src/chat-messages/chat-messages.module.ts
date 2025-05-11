import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessagesController } from './chat-messages.controller';
import { ChatMessagesService } from './chat-messages.service';
import { ChatSessionsService } from 'src/chat-sessions/chat-sessions.service';
import { UserService } from 'src/users/users.service';
import { ChatSession } from 'src/chat-sessions/chat-session.entity';
import { ChatMessage } from './chat-message.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ChatSession, ChatMessage])],
  controllers: [ChatMessagesController],
  providers: [UserService, ChatSessionsService, ChatMessagesService],
})
export class ChatMessageModule {}
