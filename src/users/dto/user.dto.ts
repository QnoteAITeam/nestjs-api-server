import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserDto {
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
  @ApiProperty({
    required: false,
    type: String,
    example: 'https://storage.com/image?id=1231231FK!@LF!',
  })
  profileImage: string | null;

  @Expose()
  @ApiProperty({ required: false, type: String, example: '010-1234-1234' })
  phoneNumber: string | null;

  @Expose()
  @ApiProperty()
  loginAttempts: number;

  @Expose()
  @ApiProperty({ type: String, example: 'local' })
  provider: 'local' | 'google' | 'kakao';

  @Expose()
  @ApiProperty()
  emailVerified: boolean;

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
