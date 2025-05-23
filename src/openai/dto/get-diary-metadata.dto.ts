import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetDiaryMetaDataByContentDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  emotionTags: string[];
}

export class GetDiaryMetaDataByContentRequestDto {
  @IsString()
  @ApiProperty()
  content: string;
}
