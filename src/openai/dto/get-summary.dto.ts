import { ApiProperty } from '@nestjs/swagger';

export class GetSummaryByContentDto {
  @ApiProperty()
  summary: string;

  @ApiProperty()
  promptingSummary: string;
}

export class GetSummaryByContentRequestDto {
  @ApiProperty()
  content: string;
}
