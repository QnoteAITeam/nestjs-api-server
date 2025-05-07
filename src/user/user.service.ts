import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { IEmail, IID } from 'src/commons/interfaces/interfaces';

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

  async createUser(username: string, email: string): Promise<User> {
    const user = this.userRepository.create({ username, email });
    return this.userRepository.save(user);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
}
