import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { In, Repository } from 'typeorm';
import { EmotionTag } from './entities/emotion-tag.entity';
import { User } from 'src/users/user.entity';
import {
  IEmotionTagFindOrCreateByNames,
  ITagFindOrCreateByNames,
} from './interfaces/tags-service.interface';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(EmotionTag)
    private readonly emotionTagRepository: Repository<EmotionTag>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //User의 관계 emotionTags들도, 다 넣어서 와야합니다. 사용 하니까요!
  async emotionTagFindOrCreateByNames({
    user,
    emotionTags,
  }: IEmotionTagFindOrCreateByNames) {
    const existingTags = await this.emotionTagRepository.find({
      where: { name: In(emotionTags) },
    });

    const existingNames: string[] = existingTags.map((tag) => tag.name);

    //existingNames : 기존 네임 목록에 포함안되어 있으면 새로운 태그이다.
    const newNames: string[] = emotionTags.filter(
      (name) => !existingNames.includes(name),
    );

    const newTags = this.emotionTagRepository.create(
      newNames.map((name) => ({ name })),
    );

    const savedNewTags = await this.emotionTagRepository.save(newTags);

    //user Tag 업데이트 해야하므로, 모든 태그를 일단 다 집어넣은 배열 선언, 중복 태그가 존재한다.
    const allTags = [...existingTags, ...savedNewTags];
    if (user.emotionTags) allTags.push(...user.emotionTags);

    const tagMaps = new Map(allTags.map((tag) => [tag.id, tag]));
    let filteredTags = Array.from(tagMaps.values());

    const userEmotionTagIds = new Set(
      user.emotionTags?.map((tag) => tag.id) ?? [],
    );

    filteredTags = filteredTags.filter((tag) => !userEmotionTagIds.has(tag.id));

    user.emotionTags = [...(user.emotionTags ?? []), ...filteredTags];
    await this.userRepository.save(user);
    return filteredTags;
  }

  //User의 관계 emotionTags들도, 다 넣어서 와야합니다. 사용 하니까요!
  async tagFindOrCreateByNames({ user, tags }: ITagFindOrCreateByNames) {
    const existingTags = await this.tagRepository.find({
      where: { name: In(tags) },
    });

    const existingNames: string[] = existingTags.map((tag) => tag.name);

    //existingNames : 기존 네임 목록에 포함안되어 있으면 새로운 태그이다.
    const newNames: string[] = tags.filter(
      (name) => !existingNames.includes(name),
    );

    const newTags = this.tagRepository.create(
      newNames.map((name) => ({ name })),
    );

    const savedNewTags = await this.tagRepository.save(newTags);

    //user Tag 업데이트 해야하므로, 모든 태그를 일단 다 집어넣은 배열 선언, 중복 태그가 존재한다.
    const allTags = [...existingTags, ...savedNewTags];
    const tagMaps = new Map(allTags.map((tag) => [tag.id, tag]));
    let filteredTags = Array.from(tagMaps.values());

    const userTagIds = new Set(user.tags?.map((tag) => tag.id) ?? []);
    filteredTags = filteredTags.filter((tag) => !userTagIds.has(tag.id));

    user.tags = [...(user.tags ?? []), ...filteredTags];
    await this.userRepository.save(user);
    return filteredTags;
  }

  //users : User[], is null: relation 반환안합니다.
  async getTagsByUser(user: User) {
    return this.tagRepository.find({
      where: {
        users: {
          id: user.id,
        },
      },
    });
  }

  async getEmotionTagsByUser(user: User) {
    return this.emotionTagRepository.find({
      where: {
        users: {
          id: user.id,
        },
      },
    });
  }
}
