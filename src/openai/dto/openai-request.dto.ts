export class ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class ChatRequestDto {
  messages: ChatMessage[];
}
