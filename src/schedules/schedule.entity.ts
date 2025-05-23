import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  context: string;

  @Column()
  startAt: Date;

  @Column()
  endAt: Date;

  @Column({ nullable: true, type: 'text' })
  location: string | null;

  @Column({ default: false })
  isAllDay: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.schedules, { onDelete: 'CASCADE' })
  user?: User;

  // 일정 관리 목록에, 일기의 카테고리도 만드는 편이 좋을 것 같은데, 이건 테이블 하나 더파서 관리하는게 좋아보임.
  //   @Column()
  //   category: string;
}
