import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetSummaryByContentDto {
  @ApiProperty()
  summary: string;

  @ApiProperty()
  promptingSummary: string;
}

export class GetSummaryByContentRequestDto {
  @IsString()
  @ApiProperty()
  content: string;
}
