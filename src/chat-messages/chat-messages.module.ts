import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessageController } from './chat-messages.controller';
import { ChatMessageService } from './chat-messages.service';
import { ChatSessionService } from 'src/chat-sessions/chat-sessions.service';
import { UserService } from 'src/users/users.service';
import { ChatSession } from 'src/chat-sessions/chat-session.entity';
import { ChatMessage } from './chat-message.entity';
import { User } from 'src/users/user.entity';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatSession, ChatMessage]), UserModule],
  controllers: [ChatMessageController],
  providers: [ChatSessionService, ChatMessageService],
})
export class ChatMessageModule {}
