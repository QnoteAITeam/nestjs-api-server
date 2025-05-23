import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  isBoolean,
  IsDate,
  IsOptional,
  IsString,
  isString,
} from 'class-validator';

export class UpdateScheduleRequestDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '정기적인 기초 프로젝트 회의', required: false })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '충남대학교 2학년 기초 프로젝트 회의이다.',
    required: false,
  })
  context?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    required: false,
    example: '2025-05-23T13:30:00.000Z',
    description: 'ISO 8601 문자열 형식으로 날짜 넣어주세요.',
  })
  startAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    required: false,
    example: '2025-05-23T13:30:00.000Z',
    description: 'ISO 8601 문자열 형식으로 날짜 넣어주세요.',
  })
  endAt?: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Api를 이용하여, 장소 주소를 알아 낼 수 있게 할 것이다.',
    required: false,
  })
  location?: string | null;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  isAllDay?: boolean;
}
