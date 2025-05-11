import { session } from 'passport';
import { ChatSession } from 'src/chat-sessions/chat-session.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 12 })
  role: 'assistant' | 'system' | 'user';

  @Column({ type: 'text' })
  text: string;

  @CreateDateColumn()
  createdAt: Date;

  @Index()
  @ManyToOne(() => ChatSession, (session) => session.messages)
  session: ChatSession;
}
