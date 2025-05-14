import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserPassword } from './user-password.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';

import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/users/users.service';

@Injectable()
export class UserPasswordService {
  constructor(
    @InjectRepository(UserPassword)
    private readonly passwordRepositiry: Repository<UserPassword>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async getHashedPasswordByUser({ user }: { user: User }) {
    return this.passwordRepositiry.findOne({
      where: { user: { id: user.id } },
    });
  }

  async matchPasswordByEmail({
    email,
    rawPassword,
  }: {
    email: string;
    rawPassword: string;
  }): Promise<boolean> {
    const user = await this.userService.findByEmail({ email });
    if (!user) throw new NotFoundException("Can't find user by Email.");

    return this.matchPasswordByUser({ user, rawPassword });
  }

  async matchPasswordByUser({
    user,
    rawPassword,
  }: {
    user: User;
    rawPassword: string;
  }) {
    const password = await this.getHashedPasswordByUser({ user });
    const isValid = await bcrypt.compare(rawPassword, password!.passwordHash);

    return isValid;
  }

  async createPassword({ rawPassword }: { rawPassword: string }) {
    const hashedPassword = await bcrypt.hash(
      rawPassword,
      parseInt(process.env.SALT_ROUNDS!),
    );

    const password = this.passwordRepositiry.create({
      passwordHash: hashedPassword,
    });

    return this.passwordRepositiry.save(password);
  }
}
