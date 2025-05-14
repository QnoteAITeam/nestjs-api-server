// src/data-source.ts

import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql', // 어떤 DB인지
  host: process.env.DB_DOCKER_NAME, // DB 주소
  port: parseInt(process.env.DB_PORT!), // 포트
  username: 'root', // DB 계정
  password: process.env.DB_ROOT_PW, // 비밀번호
  database: process.env.DB_NAME, // 사용할 DB 이름
  entities: ['dist/entities/*.js'], // 엔티티 위치
  migrations: ['dist/migrations/*.js'], // 마이그레이션 파일 위치

  migrationsRun: process.env.MYSQL_DATABASE_SYNCHRONIZE! !== 'true',
  synchronize: process.env.MYSQL_DATABASE_SYNCHRONIZE! === 'true',
});
