import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { IEmail, IID } from 'src/commons/interfaces/interfaces';
import { UserPasswordService } from 'src/user-passwords/user-passwords.service';
import { NotFoundError } from 'rxjs';
import { UserPassword } from 'src/user-passwords/user-password.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => UserPasswordService))
    private readonly userPasswordService: UserPasswordService,
  ) {}

  async findByEmail({ email }: IEmail): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findById({ id }: IID): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async createUser(email: string, password: string): Promise<User> {
    const prev = await this.findByEmail({ email });
    if (prev) throw new ConflictException('이미 사용 중인 이메일 입니다.');

    const passwordEntity = await this.userPasswordService.createPassword({
      rawPassword: password,
    });

    const user = this.userRepository.create({
      email,
      password: passwordEntity,
    });

    return this.userRepository.save(user);
  }

  async createUserWithName(
    email: string,
    password: string,
    username: string,
  ): Promise<User> {
    const prev = await this.findByEmail({ email });
    if (prev) throw new ConflictException('이미 사용 중인 이메일 입니다.');

    const passwordEntity = await this.userPasswordService.createPassword({
      rawPassword: password,
    });

    const user = this.userRepository.create({
      email,
      username,
      password: passwordEntity,
    });

    return this.userRepository.save(user);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
}
