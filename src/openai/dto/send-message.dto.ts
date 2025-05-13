export class SendMessageDto {
  role: 'system' | 'assistant' | 'user';
  state: 'asking' | 'done';
  message: string;
}

export class ResponseMessageDto {
  asking: 1 | 0;
  message: string;
}
