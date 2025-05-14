import { Diary } from 'src/diaries/diary.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  Index,
} from 'typeorm';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 10 })
  name: string;

  @ManyToMany(() => Diary, (diary) => diary.tags)
  diaries: Diary[];

  @ManyToMany(() => User, (user) => user.tags)
  users: User;
}
