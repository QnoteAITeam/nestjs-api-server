import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SearchDiaryRequestDto {
  @IsString()
  @ApiProperty({ example: '자장면' })
  query: string;

  @IsNumber()
  @ApiProperty({ example: 1, description: '페이지 번호 1이상이어야 합니다.' })
  page: number;
}
