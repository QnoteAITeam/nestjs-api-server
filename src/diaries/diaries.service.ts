import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Diary } from './diary.entity';
import { ICreate, IUpdate } from './dto/diaries-controller.dto';
import { TagService } from 'src/tags/tags.service';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    private readonly tagService: TagService,
  ) {}

  async create({
    user,
    title,
    content,
    tags,
    emotionTags,
    summary,
    promptingSummary,
  }: ICreate): Promise<Diary> {
    const diary = this.diaryRepository.create({
      title,
      content,
      user,
      tags,
      emotionTags,
      summary,
      promptingSummary,
    });

    return this.diaryRepository.save(diary);
  }

  //pagenation (페이지네이션) 을 적용하여 보냄.
  async findAll({
    user,
    page,
  }: {
    user: User;
    page: number;
  }): Promise<Diary[]> {
    const take = 50;
    const skip = (page - 1) * take;

    return this.diaryRepository.find({
      where: { user: { id: user.id } },
      relations: ['tags', 'emotionTags'],
      order: { createdAt: 'DESC' },
      take,
      skip,
    });
  }

  //유저가 가장 최근 N개의 일기를 리턴합니다.
  async findRecentN({
    user,
    count,
  }: {
    user: User;
    count: number;
  }): Promise<Diary[]> {
    return this.diaryRepository.find({
      where: { user: { id: user.id } },
      relations: ['tags', 'emotionTags'],
      order: { createdAt: 'DESC' },
      take: count,
    });
  }

  //유저가 작성한 가장 최근 일기를 가져옵니다.
  async findMostRecent(user: User): Promise<Diary | null> {
    return this.diaryRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['tags', 'emotionTags'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneById(id: number) {
    return this.diaryRepository.findOne({ where: { id } });
  }

  //id : number에 해당하는 다이어리를 업데이트함.
  async update({ id, user, updateData }: IUpdate): Promise<Diary> {
    const diary = await this.findOneById(id);

    if (diary === null)
      throw new NotFoundException(`Diary with ID ${id} not found.`);

    if (updateData.title !== undefined) diary.title = updateData.title;
    if (updateData.content !== undefined) diary.content = updateData.content;

    const updatedTags = await this.tagService.tagFindOrCreateByNames({
      user,
      tags: updateData.tags ?? [],
    });

    const updatedEmotionTags =
      await this.tagService.emotionTagFindOrCreateByNames({
        user,
        emotionTags: updateData.emotionTags ?? [],
      });

    if (updateData.tags) {
      diary.tags = updatedTags;
    }

    if (updateData.emotionTags) {
      diary.emotionTags = updatedEmotionTags;
    }

    return this.diaryRepository.save(diary);
  }

  async remove(id: number): Promise<void> {
    const diary = await this.findOneById(id);
    if (!diary)
      throw new NotFoundException(`There is no Diary.id = ${id} in DB`);

    await this.diaryRepository.remove(diary);
  }
}
