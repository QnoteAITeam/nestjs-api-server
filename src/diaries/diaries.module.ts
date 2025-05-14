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

@Module({
  imports: [
    TypeOrmModule.forFeature([Diary, Tag, EmotionTag, User]),
    UserModule,
  ],
  providers: [DiaryService, TagService],
  controllers: [DiariesController],
  exports: [DiaryService],
})
export class DiaryModule {}
