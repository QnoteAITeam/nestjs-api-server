import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ChatMessageDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty({ enum: ['assistant', 'system', 'user'] })
  role: 'assistant' | 'system' | 'user';

  @Expose()
  @ApiProperty()
  text: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;
}
