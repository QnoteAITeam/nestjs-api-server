import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenAIModule } from './openai/openai.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { ChatSessionModule } from './chat-sessions/chat-sessions.module';
import { ChatMessageModule } from './chat-messages/chat-messages.module';
import { ChatMessage } from './chat-messages/chat-message.entity';
import { ChatSession } from './chat-sessions/chat-session.entity';
import { Diary } from './diaries/diary.entitiy';
import { EmotionTag } from './tags/entities/emotion-tag.entity';
import { Tag } from './tags/entities/tag.entity';
import { DiaryModule } from './diaries/diaries.module';
import { UserPassword } from './user-passwords/user-password.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_DOCKER_NAME,
      port: parseInt(process.env.DB_PORT!),
      username: 'root',
      password: process.env.DB_ROOT_PW,
      database: process.env.DB_NAME,
      entities: [
        User,
        ChatMessage,
        ChatSession,
        Diary,
        EmotionTag,
        Tag,
        UserPassword,
      ],

      //entity로, 테이블을 자동으로 생성하고, 업데이트함.
      // migrationsRun: true,
      synchronize: true,
    }),

    OpenAIModule,
    UserModule,
    ChatSessionModule,
    ChatMessageModule,
    AuthModule,
    DiaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
