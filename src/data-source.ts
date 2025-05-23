// src/data-source.ts

import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql', // 어떤 DB인지
  host: process.env.DB_DOCKER_NAME, // DB 주소
  port: parseInt(process.env.DB_PORT!), // 포트
  username: 'root', // DB 계정
  password: process.env.DB_ROOT_PW, // 비밀번호
  database: process.env.DB_NAME, // 사용할 DB 이름

  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/**/migrations/*.js'],
  migrationsTableName: 'migrations',
});
