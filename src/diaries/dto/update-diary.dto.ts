import { ApiProperty } from '@nestjs/swagger';

export class UpdateDiaryRequestDto {
  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty({ required: false })
  content?: string;

  @ApiProperty({ required: false })
  tags?: string[];

  @ApiProperty({ required: false })
  emotionTags?: string[];
}
