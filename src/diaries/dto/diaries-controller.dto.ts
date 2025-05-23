import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { EmotionTag } from 'src/tags/entities/emotion-tag.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/users/user.entity';

export class CreateDiaryRequestDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  content: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ isArray: true, type: [String] })
  tags: string[]; // tag names

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ isArray: true, type: [String] })
  emotionTags: string[]; // emotion tag names
}

export interface ICreate {
  user: User;
  title: string;
  content: string;
  tags: Tag[];
  emotionTags: EmotionTag[];
  summary: string;
  promptingSummary: string;
}

export interface IUpdate {
  id: number;
  user: User;
  updateData: UpdateDiaryDto;
}

export interface UpdateDiaryDto {
  title?: string;
  content?: string;
  tags?: string[];
  emotionTags?: string[];
}
