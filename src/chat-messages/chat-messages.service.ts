import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage } from './chat-message.entity';
import { Repository } from 'typeorm';
import {
  ICreateMessage,
  IFindAllBySession,
  IFindRecentMessages,
} from './dto/chat-messages-service.interface';
import { ChatSession } from 'src/chat-sessions/chat-session.entity';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly messageRepository: Repository<ChatMessage>,
  ) {}

  // 특정 세션의 모든 메시지 가져오기
  async findAllBySession({
    session,
  }: IFindAllBySession): Promise<ChatMessage[]> {
    return this.messageRepository.find({
      where: { session: { id: session.id } },
      order: { createdAt: 'ASC' }, // 시간순 정렬
    });
  }

  // 특정 세션의 최근 N개 메시지 가져오기
  async findRecentMessages({
    session,
    count,
  }: IFindRecentMessages): Promise<ChatMessage[]> {
    return this.messageRepository
      .find({
        where: { session: { id: session.id } },
        order: { createdAt: 'DESC' },
        take: count,
      })
      .then((messages) => messages.reverse());
  }

  async createMessage({ session, text, role }: ICreateMessage) {
    const newMessage = this.messageRepository.create({
      session,
      text,
      role,
    });

    return this.messageRepository.save(newMessage);
  }
}
