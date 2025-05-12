import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { EmotionTag } from 'src/tags/entities/emotion-tag.entity';
import { Diary } from './diary.entitiy';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private diaryRepository: Repository<Diary>,

    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,

    @InjectRepository(EmotionTag)
    private emotionTagRepository: Repository<EmotionTag>,
  ) {}

  async create(
    user: User,
    title: string,
    content: string,
    tagIds: number[] = [],
    emotionTagIds: number[] = [],
  ): Promise<Diary> {
    const tags = await this.tagRepository.findByIds(tagIds);
    const emotionTags =
      await this.emotionTagRepository.findByIds(emotionTagIds);

    const diary = this.diaryRepository.create({
      title,
      content,
      user,
      tags,
      emotionTags,
    });

    return this.diaryRepository.save(diary);
  }

  async findAll(user: User): Promise<Diary[]> {
    return this.diaryRepository.find({
      where: { user },
      relations: ['tags', 'emotionTags'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, user: User): Promise<Diary> {
    const diary = await this.diaryRepository.findOne({
      where: { id, user },
      relations: ['tags', 'emotionTags'],
    });

    if (!diary) {
      throw new NotFoundException(`Diary with id ${id} not found`);
    }

    return diary;
  }

  async update(
    id: number,
    user: User,
    updateData: {
      title?: string;
      content?: string;
      tagIds?: number[];
      emotionTagIds?: number[];
    },
  ): Promise<Diary> {
    const diary = await this.findOne(id, user);

    if (updateData.title !== undefined) diary.title = updateData.title;
    if (updateData.content !== undefined) diary.content = updateData.content;

    if (updateData.tagIds) {
      diary.tags = await this.tagRepository.findByIds(updateData.tagIds);
    }

    if (updateData.emotionTagIds) {
      diary.emotionTags = await this.emotionTagRepository.findByIds(
        updateData.emotionTagIds,
      );
    }

    return this.diaryRepository.save(diary);
  }

  async remove(id: number, user: User): Promise<void> {
    const diary = await this.findOne(id, user);
    await this.diaryRepository.remove(diary);
  }
}
