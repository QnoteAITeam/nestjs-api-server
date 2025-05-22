import { ChatSession } from 'src/chat-sessions/chat-session.entity';
import { Diary } from 'src/diaries/diary.entity';
import { EmotionTag } from 'src/tags/entities/emotion-tag.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { UserPassword } from 'src/user-passwords/user-password.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 25, default: '꿈꿈이' })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'int', unsigned: true, nullable: true })
  age: number | undefined;

  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  //Profile Image Url을 넣을 겁니다.
  @Column({ type: 'varchar', length: 255, nullable: true })
  profileImage: string | null;

  @OneToOne(() => UserPassword, (password) => password.user, { cascade: true })
  password: UserPassword;

  //'user' or 'admin' 으로 관리할 것입니다.
  @Column({ default: 'user' })
  role: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phoneNumber: string | null;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ default: 0 })
  loginAttempts: number;

  @Column({ type: 'varchar', length: 6, default: 'local' })
  provider: 'local' | 'google' | 'kakao';

  @OneToMany(() => ChatSession, (session) => session.user)
  sessions: ChatSession[] | undefined;

  @OneToMany(() => Diary, (diary) => diary.user)
  diaries: Diary[] | undefined;

  @ManyToMany(() => EmotionTag, (emotionTag) => emotionTag.users, {
    cascade: true,
  })
  @JoinTable()
  emotionTags: EmotionTag[] | undefined;

  @ManyToMany(() => Tag, (tag) => tag.users, { cascade: true })
  @JoinTable()
  tags: Tag[] | undefined;
}
