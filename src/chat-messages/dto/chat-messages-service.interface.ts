import { ChatSession } from 'src/chat-sessions/chat-session.entity';
import { ChatMessage } from '../chat-message.entity';

export interface IFindAllBySession {
  session: ChatSession;
}

export interface IFindRecentMessages {
  session: ChatSession;
  count: number;
}

export interface ICreateMessage {
  session: ChatSession;
  text: string;
  role: ChatMessage['role'];
}
