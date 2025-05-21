import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
  NotFoundException,
  Get,
  Query,
  ParseIntPipe,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateDiaryDto, UpdateDiaryDto } from './dto/diaries-controller.dto';
import { EmotionTag } from 'src/tags/entities/emotion-tag.entity';
import { User as Payload } from 'src/auth/auth-user.decorator';
import { IPayLoad } from 'src/commons/interfaces/interfaces';
import { UserService } from 'src/users/users.service';
import { TagService } from 'src/tags/tags.service';
import { DiaryService } from './diaries.service';
import { get } from 'http';
import { Diary } from './diary.entity';
import { OpenAIService } from 'src/openai/openai.service';
import { SummaryDto } from 'src/openai/dto/summary.dto';

@Controller('diaries')
export class DiariesController {
  constructor(
    private readonly diaryService: DiaryService,
    private readonly tagService: TagService,
    private readonly userService: UserService,
    private readonly openAIService: OpenAIService,
  ) {}

  //   "title": "오늘의 일기",
  //   "content": "기분이 좋았던 하루였다.",
  //   "tags": ["공부", "운동"],
  //   "emotionTags": ["행복", "뿌듯함"]
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Payload() payload: IPayLoad, @Body() dto: CreateDiaryDto) {
    const user = await this.userService.findByIdWithTags({ id: payload.sub });

    if (user === null || user === undefined)
      throw new NotFoundException('There is no User Entity in DB');

    const [tagEntities, emotionTagEntities] = await Promise.all([
      this.tagService.tagFindOrCreateByNames({ user, tags: dto.tags }),
      this.tagService.emotionTagFindOrCreateByNames({
        user,
        emotionTags: dto.emotionTags,
      }),
    ]);

    const summary: SummaryDto =
      await this.openAIService.getDiarySummaryByContent(dto.content);

    const diary = await this.diaryService.create({
      user,
      title: dto.title,
      content: dto.content,
      tags: tagEntities,
      emotionTags: emotionTagEntities,
      summary: summary.summary,
      promptingSummary: summary.promptingSummary,
    });

    return diary;
  }

  // 'baseurl/diaries?page=${number}
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Payload() payload: IPayLoad,
    @Query('page', ParseIntPipe) page: number,
  ) {
    const user = await this.userService.findById({ id: payload.name });

    if (user === null)
      throw new NotFoundException(
        `There is no Imformation for User.id = ${payload.sub}`,
      );

    return this.diaryService.findAll({ user, page });
  }

  //baseurl/diaires?count=${number}
  @Get('recent')
  @UseGuards(JwtAuthGuard)
  async findRecentN(
    @Payload() payload: IPayLoad,
    @Query('count', ParseIntPipe) count: number,
  ) {
    const user = await this.userService.findById({ id: payload.name });

    if (user === null)
      throw new NotFoundException(
        `There is no Imformation for User.id = ${payload.sub}`,
      );

    return this.diaryService.findRecentN({ user, count });
  }

  @Get('recent/one')
  @UseGuards(JwtAuthGuard)
  async findMostRecent(@Payload() payload: IPayLoad) {
    const user = await this.userService.findById({ id: payload.name });
    if (!user)
      throw new NotFoundException(`User with ID ${payload.sub} not found.`);

    return this.diaryService.findMostRecent(user);
  }

  // baseurl/diaries/231241  <<- diary.id
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const diary = await this.diaryService.findOneById(id);
    if (!diary) throw new NotFoundException(`Diary with ID ${id} not found.`);
    return diary;
  }

  // baseurl/diaries/123123
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Payload() payload: IPayLoad,
    @Body() updateData: UpdateDiaryDto,
  ) {
    const user = await this.userService.findById({ id: payload.name });
    if (!user)
      throw new NotFoundException(`User with ID ${payload.sub} not found.`);

    return this.diaryService.update({ id, user, updateData });
  }

  // baseurl/diaries/123123
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.diaryService.remove(id);
  }
}
