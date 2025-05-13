export class AIRequestMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class AIRequestDto {
  messages: AIRequestMessage[];
}
