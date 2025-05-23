import { ApiProperty } from '@nestjs/swagger';

export class RestoreDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NzU3MjcwMi05ZWUwLTRjYTQtYTM4MC0wMzFiYzBhMzEwYWMiLCJuYW1lIjoi6r-I6r-I7J20IiwicHJvdmlkZXIiOiJsb2NhbCIsImlhdCI6MTc0NzkyNTU2MiwiZXhwIjoxNzQ3OTM2MzYyfQ.3H7sj6qA0sPUwyJz-2qBG3sNJfINB53Je7kIQAZreVg',
  })
  accessToken: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NzU3MjcwMi05ZWUwLTRjYTQtYTM4MC0wMzFiYzBhMzEwYWMiLCJuYW1lIjoi6r-I6r-I7J20IiwicHJvdmlkZXIiOiJsb2NhbCIsImlhdCI6MTc0NzkyNjI3MSwiZXhwIjoxNzQ4NTMxMDcxfQ.m4l08ZHOxWhX46iU1oUVFosTgs5726o09p4vvdPvIH0',
  })
  refreshToken: string;
}
