import {
  Controller,
  Post,
  Body,
  UseGuards,
  NotFoundException,
  Get,
  Query,
  ParseIntPipe,
  Param,
  Put,
  Delete,
  HttpCode,
  ForbiddenException,
  DefaultValuePipe,
  Search,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateDiaryRequestDto } from './dto/diaries-controller.dto';
import { User as Payload } from 'src/auth/auth-user.decorator';
import { IPayLoad } from 'src/commons/interfaces/interfaces';
import { UserService } from 'src/users/users.service';
import { TagService } from 'src/tags/tags.service';
import { DiaryService } from './diaries.service';

import { OpenAIService } from 'src/openai/openai.service';
import { SummaryDto } from 'src/openai/dto/summary.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { DiaryDto } from './dto/diary.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateDiaryRequestDto } from './dto/update-diary.dto';
import { SearchDiaryRequestDto } from './dto/search-diary.dto';

@Controller('diaries')
export class DiariesController {
  constructor(
    private readonly diaryService: DiaryService,
    private readonly tagService: TagService,
    private readonly userService: UserService,
    private readonly openAIService: OpenAIService,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'Diary 생성에 성공했습니다.',
    type: DiaryDto,
  })
  @ApiOperation({ summary: '일기 생성 API' })
  @ApiBody({ type: CreateDiaryRequestDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  async create(
    @Payload() payload: IPayLoad,
    @Body() dto: CreateDiaryRequestDto,
  ) {
    const user = await this.userService.findByIdWithTags({ id: payload.sub });

    console.log('==========================');
    console.log(JSON.stringify(dto));

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

    const response = plainToInstance(DiaryDto, diary, {
      excludeExtraneousValues: true,
    });

    console.log(JSON.stringify(diary));

    return {
      ...response,
      tags: diary.tags.map((tag) => tag.name),
      emotionTags: diary.emotionTags.map((tag) => tag.name),
    } as DiaryDto;
  }

  @ApiResponse({
    status: 200,
    description: '1개의 페이지 (10개) 에 대한 일기 조회에 성공했습니다.',
    type: DiaryDto,
    isArray: true,
  })
  @ApiOperation({ summary: '특정 1개 페이지 (10개) 에 대한 일기 조회' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(200)
  async findAll(
    @Payload() payload: IPayLoad,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  ) {
    const user = await this.userService.findById({ id: payload.sub });

    if (user === null)
      throw new NotFoundException(
        `There is no Imformation for User.id = ${payload.sub}`,
      );

    const diaries = await this.diaryService.findAll({ user, page });

    const response = plainToInstance(DiaryDto, diaries, {
      excludeExtraneousValues: true,
    });

    return response.map((diary, index) => {
      return {
        ...diary,
        tags: diaries[index].tags.map((tag) => tag.name),
        emotionTags: diaries[index].emotionTags.map((tag) => tag.name),
      };
    });
  }

  @ApiResponse({
    status: 200,
    description: 'text에 대한, 제목과 내용에 대한 일기 검색에 성공했습니다.',
    type: DiaryDto,
    isArray: true,
  })
  @ApiOperation({ summary: '일기 검색 API' })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: SearchDiaryRequestDto })
  @UseGuards(JwtAuthGuard)
  @Post('search')
  @HttpCode(200)
  async searchDiaries(
    @Body() { query, page }: SearchDiaryRequestDto,
    @Payload() payload: IPayLoad,
  ): Promise<DiaryDto[]> {
    const diaries = await this.diaryService.searchDiaries({
      query,
      page,
      userId: payload.sub,
    });

    const response = plainToInstance(DiaryDto, diaries, {
      excludeExtraneousValues: true,
    });

    return response.map((diary, index) => {
      return {
        ...diary,
        tags: diaries[index].tags.map((tag) => tag.name),
        emotionTags: diaries[index].emotionTags.map((tag) => tag.name),
      };
    });
  }

  @ApiResponse({
    status: 200,
    description: '최근 N개에 대한 일기 조회에 성공했습니다.',
    type: DiaryDto,
    isArray: true,
  })
  @ApiOperation({ summary: '최근 N개에 대한 일기 조회' })
  @ApiBearerAuth('access-token')
  @Get('recent')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async findRecentN(
    @Payload() payload: IPayLoad,
    @Query('count', new DefaultValuePipe(1), ParseIntPipe) count: number = 5,
  ) {
    const user = await this.userService.findById({ id: payload.sub });

    if (user === null)
      throw new NotFoundException(
        `There is no Imformation for User.id = ${payload.sub}`,
      );

    const diaries = await this.diaryService.findRecentN({ user, count });

    const response = plainToInstance(DiaryDto, diaries, {
      excludeExtraneousValues: true,
    });

    return response.map((diary, index) => {
      return {
        ...diary,
        tags: diaries[index].tags.map((tag) => tag.name),
        emotionTags: diaries[index].emotionTags.map((tag) => tag.name),
      };
    });
  }

  @ApiResponse({
    status: 200,
    description: '최근 일기 조회에 성공했습니다.',
    type: DiaryDto,
  })
  @ApiOperation({ summary: '최근 일기 조회' })
  @ApiBearerAuth('access-token')
  @Get('recent/one')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async findMostRecent(@Payload() payload: IPayLoad) {
    const user = await this.userService.findById({ id: payload.sub });

    if (!user)
      throw new NotFoundException(`User with ID ${payload.sub} not found.`);

    const diary = await this.diaryService.findMostRecent(user);

    if (!diary) throw new NotFoundException('최근 일기가 없습니다.');

    const response = plainToInstance(DiaryDto, diary, {
      excludeExtraneousValues: true,
    });

    return {
      ...response,
      tags: diary.tags.map((tag) => tag.name),
      emotionTags: diary.emotionTags.map((tag) => tag.name),
    };
  }

  @ApiResponse({
    status: 200,
    description: '특정 일기 조회에 성공했습니다.',
    type: DiaryDto,
  })
  @ApiOperation({ summary: '아이디로 특정 일기 조회' })
  @ApiBearerAuth('access-token')
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Payload() payload: IPayLoad,
  ) {
    const diary = await this.diaryService.findOneByIdWithRelations(id, [
      'user',
      'tags',
      'emotionTags',
    ]);

    if (!diary) throw new NotFoundException(`Diary with ID ${id} not found.`);

    if (diary.user.id !== payload.sub)
      throw new ForbiddenException('이 일기에 접근할 권한이 없습니다.');

    const response = plainToInstance(DiaryDto, diary, {
      excludeExtraneousValues: true,
    });

    return {
      ...response,
      tags: diary.tags.map((tag) => tag.name),
      emotionTags: diary.emotionTags.map((tag) => tag.name),
    };
  }

  @ApiResponse({
    status: 201,
    description: '특정 일기 업데이트에 성공했습니다.',
    type: DiaryDto,
  })
  @ApiOperation({ summary: '일기 아이디로 특정 일기 업데이트' })
  @ApiBody({ type: UpdateDiaryRequestDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(201)
  async updateDiary(
    @Param('id', ParseIntPipe) id: number,
    @Payload() payload: IPayLoad,
    @Body() updateData: UpdateDiaryRequestDto,
  ) {
    const user = await this.userService.findById({ id: payload.sub });
    if (!user)
      throw new NotFoundException(`User with ID ${payload.sub} not found.`);

    const diary = await this.diaryService.update({ id, user, updateData });

    const response = plainToInstance(DiaryDto, diary, {
      excludeExtraneousValues: true,
    });

    return {
      ...response,
      tags: diary.tags.map((tag) => tag.name),
      emotionTags: diary.emotionTags.map((tag) => tag.name),
    };
  }

  @ApiResponse({
    status: 200,
    description: '특정 일기 삭제에 성공했습니다.',
    type: DiaryDto,
  })
  @ApiOperation({ summary: '일기 아이디로 특정 일기 삭제' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(200)
  async removeDiary(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.diaryService.remove(id);

    const response = plainToInstance(DiaryDto, deleted, {
      excludeExtraneousValues: true,
    });

    return {
      ...response,
      tags: deleted.tags.map((tag) => tag.name),
      emotionTags: deleted.emotionTags.map((tag) => tag.name),
    };
  }
}
