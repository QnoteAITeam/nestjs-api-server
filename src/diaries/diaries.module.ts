import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from './diary.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { EmotionTag } from 'src/tags/entities/emotion-tag.entity';
import { DiaryService } from './diaries.service';
import { DiariesController } from './diaries.controller';
import { User } from 'src/users/user.entity';
import { UserService } from 'src/users/users.service';
import { TagService } from 'src/tags/tags.service';
import { UserModule } from 'src/users/users.module';
import { OpenAIService } from 'src/openai/openai.service';
import { ChatSessionService } from 'src/chat-sessions/chat-sessions.service';
import { ChatMessageService } from 'src/chat-messages/chat-messages.service';
import { ChatMessage } from 'src/chat-messages/chat-message.entity';
import { ChatSession } from 'src/chat-sessions/chat-session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Diary,
      Tag,
      EmotionTag,
      User,
      ChatMessage,
      ChatSession,
    ]),
    UserModule,
  ],
  providers: [
    DiaryService,
    TagService,
    OpenAIService,
    ChatSessionService,
    ChatMessageService,
  ],
  controllers: [DiariesController],
  exports: [DiaryService],
})
export class DiaryModule {}
