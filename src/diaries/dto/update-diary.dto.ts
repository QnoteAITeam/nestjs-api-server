import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateDiaryRequestDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ required: false })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ required: false })
  emotionTags?: string[];
}
