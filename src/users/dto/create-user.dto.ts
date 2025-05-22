import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateUserDto {
  @Expose()
  @ApiProperty({ example: 'f0588b42-1340-4c28-b0bb-e41a56bb66dc' })
  id: string;

  @Expose()
  @ApiProperty({ example: '꿈꿈이' })
  username: string;

  @Expose()
  @ApiProperty({ example: 'hhs2003@o.cnu.ac.kr' })
  email: string;

  @Expose()
  @ApiProperty({ required: false, type: Number, example: 25 })
  age: number | undefined;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updateAt: Date;

  @Expose()
  @ApiProperty({ example: 'user' })
  role: 'user' | 'admin';
}

export class CreateUserRequestDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  username: string;
}
