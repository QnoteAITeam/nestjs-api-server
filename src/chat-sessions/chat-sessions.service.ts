import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatSession } from './chat-session.entity';
import { Repository } from 'typeorm';
import {
  IFindRecentSessionsByUser,
  IUser,
} from './dto/chat-sessions-service.interface';
import { User } from 'src/users/user.entity';
import { ChatMessage } from 'src/chat-messages/chat-message.entity';
import { ChatMessageService } from 'src/chat-messages/chat-messages.service';
import { assistant1 } from 'src/commons/constants/prompts';

@Injectable()
export class ChatSessionService {
  constructor(
    @InjectRepository(ChatSession)
    private readonly sessionRepository: Repository<ChatSession>,
    @InjectRepository(ChatMessage)
    private readonly messageRepository: Repository<ChatMessage>,

    private readonly chatMessageService: ChatMessageService,
  ) {}

  async findById({ id }: { id: number }) {
    return this.sessionRepository.findOne({ where: { id } });
  }

  // 가장 최근의 세션 하나
  async findMostRecentByUser({ user }: IUser): Promise<ChatSession | null> {
    return this.sessionRepository.findOne({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
      relations: ['messages'], // 필요 시
    });
  }

  // 최근 N개의 세션
  async findRecentSessionsByUser({
    user,
    count,
  }: IFindRecentSessionsByUser): Promise<ChatSession[]> {
    return this.sessionRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
      take: count,
      // relations: ['messages'], // 필요 시
    });
  }

  // 유저의 모든 세션
  async findAllByUser({ user }: IUser): Promise<ChatSession[]> {
    return this.sessionRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
      relations: ['messages'], // 필요 시
    });
  }

  async createSessionForUser({ user }: { user: User }): Promise<ChatSession> {
    const instance = this.sessionRepository.create({ user }); // 엔티티 인스턴스 생성
    const session: ChatSession = await this.sessionRepository.save(instance); // 저장 및 반환
    await this.chatMessageService.createMessage({
      role: 'system',
      text: assistant1,
      session,
    });

    return session;
  }
}
