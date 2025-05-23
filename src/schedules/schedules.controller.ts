import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  Put,
  UseGuards,
  ForbiddenException,
  HttpCode,
  Req,
  Query,
  ParseDatePipe,
} from '@nestjs/common';
import { ScheduleService } from './schedules.service';
import { Schedule } from './schedule.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/auth-user.decorator';
import { IPayLoad } from 'src/commons/interfaces/interfaces';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ScheduleDto } from './dto/schedule.dto';
import { CreateDiaryRequestDto } from 'src/diaries/dto/diaries-controller.dto';
import { CreateScheduleRequestDto } from './dto/create-schedule.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateScheduleRequestDto } from './dto/update-schedule.dto';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @ApiOperation({ summary: '일정 하나 생성' })
  @ApiResponse({
    status: 201,
    description: '일정 생성 성공',
    type: ScheduleDto,
  })
  @ApiBody({ type: CreateScheduleRequestDto })
  async create(
    @User() payload: IPayLoad,
    @Body() body: CreateScheduleRequestDto,
  ): Promise<ScheduleDto> {
    const schedule = await this.scheduleService.create({
      scheduleData: body,
      user: { id: payload.sub }, // Partial<User>로 id만 넘김
    });

    return plainToInstance(ScheduleDto, schedule, {
      excludeExtraneousValues: true,
    });
  }

  @ApiResponse({
    status: 200,
    description:
      'ISO 8601 형식의 날짜를 받아, 그 날 포함되는 일정을 모두 가져온다.',
    type: ScheduleDto,
    isArray: true,
  })
  @ApiOperation({ summary: '날짜에 해당되는, 일정 조회' })
  @ApiQuery({
    name: 'date',
    description: 'ISO 8601 포멧팅된 문자열로 날짜 파라미터를 넣어주세요.',
    example: '2025-05-23T15:25:06.813Z',
    type: String,
  })
  @Get('by-date')
  async getSchedulesByDate(
    @Query('date') dateString: string,
    @User() payload: IPayLoad,
  ) {
    const schedules = await this.scheduleService.findSchedulesByDateAndUser_KST(
      {
        dateString,
        userId: payload.sub,
      },
    );

    return plainToInstance(ScheduleDto, schedules, {
      excludeExtraneousValues: true,
    });
  }

  @Post('bulk')
  @ApiOperation({ summary: '여러 일정 한꺼번에 생성' })
  @ApiResponse({
    status: 201,
    description: '일정들 생성 성공',
    type: ScheduleDto,
    isArray: true,
  })
  @ApiBody({ type: CreateScheduleRequestDto, isArray: true })
  async createMany(
    @User() payload: IPayLoad,
    @Body() dtoList: CreateScheduleRequestDto[],
  ): Promise<ScheduleDto[]> {
    const schedules = await this.scheduleService.createMany({
      scheduleDataList: dtoList,
      user: { id: payload.sub },
    });

    return plainToInstance(ScheduleDto, schedules, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @ApiOperation({ summary: '내 일정 전체 조회' })
  @ApiResponse({ status: 200, type: [ScheduleDto] })
  async findAll(@User() payload: IPayLoad): Promise<ScheduleDto[]> {
    const schedules = await this.scheduleService.findAllByUser({
      user: { id: payload.sub },
    });

    return plainToInstance(ScheduleDto, schedules, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: '일정 단건 조회' })
  @ApiResponse({ status: 200, type: ScheduleDto })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @User() payload: IPayLoad,
  ): Promise<ScheduleDto> {
    const schedule = await this.scheduleService.findOneById({ id });

    if (schedule.user!.id !== payload.sub)
      throw new ForbiddenException('해당 일기에 대한 권한이 없습니다.');

    return plainToInstance(ScheduleDto, schedule, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: '일정 수정' })
  @ApiResponse({ status: 200, type: ScheduleDto })
  @ApiBody({ type: UpdateScheduleRequestDto })
  @HttpCode(200)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateScheduleRequestDto,
    @User() payload: IPayLoad,
  ): Promise<ScheduleDto> {
    const schedule = await this.scheduleService.update({
      id,
      updateData: dto,
      userId: payload.sub,
    });

    return plainToInstance(ScheduleDto, schedule, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: '일정 삭제' })
  @ApiResponse({ status: 204, description: '삭제 성공' })
  @HttpCode(204)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @User() payload: IPayLoad,
  ): Promise<void> {
    return await this.scheduleService.remove({ id, userId: payload.sub });
  }
}
