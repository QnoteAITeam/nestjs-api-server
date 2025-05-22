import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { EmotionTag } from 'src/tags/entities/emotion-tag.entity';

@Entity()
export class Diary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    default: '일기 제목을 작성해주세요.',
    length: 255,
  })
  title: string;

  @Column('text')
  content: string;

  @Column('text')
  summary: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.diaries, { onDelete: 'CASCADE' })
  user: User;

  @ManyToMany(() => Tag, { cascade: true })
  @JoinTable()
  tags: Tag[];

  @ManyToMany(() => EmotionTag, { cascade: true })
  @JoinTable()
  emotionTags: EmotionTag[];

  @Column('text')
  promptingSummary: string;
}
