import { EmotionTag } from 'src/tags/entities/emotion-tag.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/users/user.entity';

export class CreateDiaryDto {
  title: string;
  content: string;
  tags: string[]; // tag names
  emotionTags: string[]; // emotion tag names
}

export interface ICreate {
  user: User;
  title: string;
  content: string;
  tags: Tag[];
  emotionTags: EmotionTag[];
}

export interface IUpdate {
  id: number;
  user: User;
  updateData: UpdateDiaryDto;
}

export interface UpdateDiaryDto {
  title?: string;
  content?: string;
  tags?: Tag[];
  emotionTags?: EmotionTag[];
}
