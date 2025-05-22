import { ApiProperty } from '@nestjs/swagger';

export class LocalLoginTestDto {
  @ApiProperty()
  valid: boolean;
}
