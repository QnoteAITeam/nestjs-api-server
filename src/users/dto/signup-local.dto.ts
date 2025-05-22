import { ApiProperty } from '@nestjs/swagger';

export class SignUpLocalRequestDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
