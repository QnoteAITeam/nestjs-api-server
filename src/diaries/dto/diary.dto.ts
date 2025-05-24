import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DiaryDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  content: string;

  @Expose()
  @ApiProperty()
  summary: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;

  @Expose()
  @ApiProperty()
  promptingSummary: string;

  @Expose()
  @ApiProperty({ type: [String], example: [] })
  tags?: string[];

  @Expose()
  @ApiProperty({ type: [String], example: ['기쁨', '배부름'] })
  emotionTags?: string[];
}
