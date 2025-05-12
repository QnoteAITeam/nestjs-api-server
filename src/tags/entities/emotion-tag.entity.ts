import { Diary } from 'src/diaries/diary.entitiy';
import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  Index,
} from 'typeorm';

@Entity('emotion_tags')
export class EmotionTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true, length: 10 })
  name: string;

  @ManyToMany(() => Diary, (diary) => diary.emotionTags)
  diaries: Diary[];

  @ManyToMany(() => User, (user) => user.emotionTags)
  users: User;
}
