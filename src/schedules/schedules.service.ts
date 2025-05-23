import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './schedule.entity';
import { Repository } from 'typeorm';
import {
  ICreate,
  ICreateMany,
  IFindAllByUser,
  IFindOneById,
  IFindSchedulesByDateAndUser_KST,
  IUpdate,
} from './interfaces/schedules-service.interface';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async create({ scheduleData, user }: ICreate): Promise<Schedule> {
    const schedule = this.scheduleRepository.create({
      ...scheduleData,
      user,
    });
    return await this.scheduleRepository.save(schedule);
  }

  async createMany({
    scheduleDataList,
    user,
  }: ICreateMany): Promise<Schedule[]> {
    // 1. 각각의 scheduleData에 user 관계를 넣어주고 Schedule 객체 생성
    const schedules = scheduleDataList.map((data) =>
      this.scheduleRepository.create({
        ...data,
        user,
      }),
    );

    // 2. 한 번에 save (배열 저장 가능)
    return await this.scheduleRepository.save(schedules);
  }

  async findAllByUser({ user }: IFindAllByUser): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: { user: { id: user.id } },
      order: { startAt: 'ASC' },
    });
  }

  //user Relations 항상 활성화.
  async findOneById({ id }: IFindOneById): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!schedule) {
      throw new NotFoundException(`ID ${id}에 해당하는 일정이 없습니다.`);
    }

    return schedule;
  }

  async update({ id, updateData, userId }: IUpdate): Promise<Schedule> {
    const schedule = await this.findOneById({ id });

    if (schedule.user!.id !== userId)
      throw new ForbiddenException('일기를 수정할 권한이 없습니다.');

    Object.assign(schedule, updateData);

    return await this.scheduleRepository.save(schedule);
  }

  async remove({ id, userId }: { id: number; userId: string }): Promise<void> {
    const schedule = await this.findOneById({ id: id });

    if (schedule.user!.id !== userId)
      throw new ForbiddenException('일기를 수정할 권한이 없습니다.');

    await this.scheduleRepository.remove(schedule);
  }

  async findSchedulesByDateAndUser_KST({
    dateString,
    userId,
  }: IFindSchedulesByDateAndUser_KST): Promise<Schedule[]> {
    const date = new Date(dateString);

    //유효하지 않은 String이 들어올 시, Invalid Date 객체를 만듬..
    //그리고, date.getTime()을 하면, NaN (Not a Number) 반환함.
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string');
    }

    // 한국 시간으로 변환 (UTC + 9시간)
    // 한국 시간으로 (360 + 분)
    const KST_OFFSET = 9 * 60;

    // date를 밀리초로 바꾸고 +9시간
    const utcTime = date.getTime();

    //kstTime은, UTC 보다 해당 밀리초 더 빠른것임.
    const kstTime = utcTime + KST_OFFSET * 60 * 1000;

    const kstDate = new Date(kstTime);

    // KST 기준 날짜의 00:00:00 ~ 23:59:59.999
    const startOfDay = new Date(kstDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(kstDate);
    endOfDay.setHours(23, 59, 59, 999);

    // 다시 UTC로 변환 (DB에 저장된 시간이 UTC라면) 구간 평행이동 시키는 것과 같다고 생각하면 된다.
    const startUTC = new Date(startOfDay.getTime() - KST_OFFSET * 60 * 1000);
    const endUTC = new Date(endOfDay.getTime() - KST_OFFSET * 60 * 1000);

    return this.scheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.startAt <= :endUTC', { endUTC })
      .andWhere('schedule.endAt >= :startUTC', { startUTC })
      .andWhere('schedule.userId = :userId', { userId })
      .getMany();
  }
}
