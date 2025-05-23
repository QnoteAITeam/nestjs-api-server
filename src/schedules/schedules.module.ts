import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesController } from './schedules.controller';
import { ScheduleService } from './schedules.service';
import { Schedule } from './schedule.entity';
import { User } from 'src/users/user.entity';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, User]), UserModule],
  controllers: [SchedulesController],
  providers: [ScheduleService],
})
export class SchedulesModule {}
