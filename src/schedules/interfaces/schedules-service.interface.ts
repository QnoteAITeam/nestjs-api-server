import { User } from 'src/users/user.entity';
import { Schedule } from '../schedule.entity';
import { ScheduleDto } from '../dto/schedule.dto';
import { CreateScheduleRequestDto } from '../dto/create-schedule.dto';

export interface ICreate {
  scheduleData: Partial<Schedule>;
  user: Partial<User> & { id: string };
}

export interface IFindAllByUser {
  user: Partial<User> & { id: string };
}

export interface IFindOneById {
  id: number;
}

export interface IUpdate {
  id: number;
  updateData: Partial<Omit<Schedule, 'createdAt' | 'updatedAt'>>;
  userId: string;
}

export interface ICreateMany {
  scheduleDataList: CreateScheduleRequestDto[];
  user: Partial<User> & { id: string };
}

export interface IFindSchedulesByDateAndUser_KST {
  dateString: string;
  userId: string;
}
