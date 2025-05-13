import { User } from 'src/users/user.entity';

export interface IUser {
  user: User;
}

export interface IFindRecentSessionsByUser {
  user: User;
  count: number;
}
