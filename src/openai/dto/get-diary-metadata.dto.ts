import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty()
  content: string;
}
