import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { IEmail, IID } from 'src/commons/interfaces/interfaces';
import * as bcrypt from 'bcryptjs';
import { hash } from 'crypto';
import { ConflictError } from 'openai';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail({ email }: IEmail): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById({ id }: IID): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async createUser(email: string, password: string): Promise<User> {
    const prev = await this.findByEmail({ email });
    if (prev) throw new ConflictException('이미 사용 중인 이메일 입니다.');

    const hashed = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS!),
    );

    const user = this.userRepository.create({ email, password: hashed });
    return this.userRepository.save(user);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
}
