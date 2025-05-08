import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenAIModule } from './openai/openai.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_DOCKER_NAME,
      port: parseInt(process.env.DB_PORT!),
      username: 'root',
      password: process.env.DB_ROOT_PW,
      database: process.env.DB_NAME,
      entities: [User],

      //entity로, 테이블을 자동으로 생성하고, 업데이트함.
      synchronize: true,
    }),

    OpenAIModule,
    UserModule,
    // AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
