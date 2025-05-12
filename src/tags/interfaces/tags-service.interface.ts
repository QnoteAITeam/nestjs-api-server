import { User } from 'src/users/user.entity';

export interface IEmotionTagFindOrCreateByNames {
  user: User;
  emotionTags: string[];
}

export interface ITagFindOrCreateByNames {
  user: User;
  tags: string[];
}
