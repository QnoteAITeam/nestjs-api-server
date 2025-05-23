import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsString } from 'class-validator';

export class CreateScheduleRequestDto {
  @IsString()
  @ApiProperty({ example: '정기적인 기초 프로젝트 회의' })
  title: string;

  @IsString()
  @ApiProperty({ example: '충남대학교 2학년 기초 프로젝트 회의이다.' })
  context: string;

  @IsDate()
  @ApiProperty()
  @Type(() => Date)
  startAt: Date;

  @IsDate()
  @ApiProperty()
  @Type(() => Date)
  endAt: Date;

  @IsString()
  @ApiProperty({
    example: 'Api를 이용하여, 장소 주소를 알아 낼 수 있게 할 것이다.',
    required: false,
  })
  location?: string;

  @IsBoolean()
  @ApiProperty()
  isAllDay: boolean;
}
