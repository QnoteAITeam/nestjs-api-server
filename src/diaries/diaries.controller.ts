import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { DiariesService } from './diaries.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateDiaryDto } from './dto/diaries-controller.dto';
import { EmotionTag } from 'src/tags/entities/emotion-tag.entity';
import { User } from 'src/auth/auth-user.decorator';
import { IPayLoad } from 'src/commons/interfaces/interfaces';
import { UserService } from 'src/users/users.service';

@Controller('diaries')
export class DiariesController {
  constructor(
    private readonly diariesService: DiariesService,
    private readonly tagsService: TagsService,
    private readonly emotionTagsService: EmotionTagsService,
    private readonly userService: UserService,
  ) {}

  //   "title": "오늘의 일기",
  //   "content": "기분이 좋았던 하루였다.",
  //   "tags": ["공부", "운동"],
  //   "emotionTags": ["행복", "뿌듯함"]
  @UseGuards(JwtAuthGuard)
  @Post('my')
  async create(@User() payload: IPayLoad, @Body() dto: CreateDiaryDto) {
    const user = this.userService.findById({ id: payload.sub });

    const tagEntities = await this.tagsService.findOrCreateByNames(dto.tags);
    const emotionTagEntities =
      await this.emotionTagsService.findOrCreateByNames(dto.emotionTags);

    const diary = await this.diariesService.create({
      user,
      title: dto.title,
      content: dto.content,
      tags: tagEntities,
      emotionTags: emotionTagEntities,
    });

    return { id: diary.id };
  }
}
