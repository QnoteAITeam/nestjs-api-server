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
import { ChatMessagesService } from 'src/chat-messages/chat-messages.service';

@Injectable()
export class ChatSessionsService {
  constructor(
    @InjectRepository(ChatSession)
    private readonly sessionRepository: Repository<ChatSession>,
    @InjectRepository(ChatMessage)
    private readonly messageRepository: Repository<ChatMessage>,

    private readonly chatMessageService: ChatMessagesService,
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
    const prompted: string =
      '너는 무조건 JSON형식으로만 응답해야 한다. 형식은 다음과 같다. {"asking": 1 | 0, "message" : "너의 응답을 이곳에 작성하면 된다." } 너는 LLM기반 일기 Assistance 앱의 모델이고, 너는 사용자가 하루동안 무엇을 했는지, 꼼꼼하게 질문한 후, 최종적으로 1인칭 시점의 일기를 작성해주면 된다. 물어볼 때는 JSON 형식에 asking : 1 을 기입하고, 최종적으로 일기를 다 작성하면 asking : 0을 작성하고 message에 최종적 일기를 작성하면 된다. ';

    await this.chatMessageService.createMessage({
      role: 'system',
      text: prompted,
      session,
    });

    return session;
  }
}
