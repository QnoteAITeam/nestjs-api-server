import { ChatSession } from 'src/chat-sessions/chat-session.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

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

  @Column({ type: 'varchar', length: 65, nullable: true })
  password: string | null;

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
  sessions: ChatSession[];
}
