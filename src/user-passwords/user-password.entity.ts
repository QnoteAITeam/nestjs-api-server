import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user_passwords')
export class UserPassword {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.password, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user' })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
