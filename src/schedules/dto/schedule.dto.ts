import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class ScheduleDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: '정기적인 기초 프로젝트 회의' })
  title: string;

  @Expose()
  @ApiProperty({ example: '충남대학교 2학년 기초 프로젝트 회의이다.' })
  context: string;

  @Expose()
  @ApiProperty()
  @Type(() => Date)
  startAt: Date;

  @Expose()
  @ApiProperty()
  @Type(() => Date)
  endAt: Date;

  @Expose()
  @ApiProperty({
    example: 'Api를 이용하여, 장소 주소를 알아 낼 수 있게 할 것이다.',
  })
  location: string | null;

  @Expose()
  @ApiProperty()
  isAllDay: boolean;

  @Expose()
  @ApiProperty()
  @Type(() => Date)
  createdAt: Date;

  @Expose()
  @ApiProperty()
  @Type(() => Date)
  updatedAt: Date;
}
