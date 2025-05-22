import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ChatSessionDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  createdAt: Date;
}
