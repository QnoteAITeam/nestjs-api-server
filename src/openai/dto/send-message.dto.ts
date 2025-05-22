import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({
    enum: ['system', 'assistant', 'user'],
    description: '메세지를 보낸 주체',
    example: 'user',
  })
  role: 'system' | 'assistant' | 'user';

  @ApiProperty({
    enum: ['asking', 'done'],
    description: 'AI의 응답 중, 답변의 상태.',
    example: 'asking',
  })
  state: 'asking' | 'done';

  @ApiProperty()
  message: string;
}

export class ResponseMessageDto {
  asking: 1 | 0;
  message: string;
}

export class SendMessageRequestDto {
  @ApiProperty()
  message: string;
}
