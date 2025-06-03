# QnoteAI NestJS API 서버

QnoteAI의 백엔드 서버는 NestJS로 구축된 RESTful API 서버입니다.  
주요 기능은 사용자 인증, 일기/태그/스케줄 관리, AI 기반 챗, 그리고 다양한 데이터 엔티티 관리입니다.

---

## 폴더 및 주요 파일 구조

- `/src`
  - `main.ts` : 앱 부트스트랩, 글로벌 파이프, Swagger 문서 자동화
  - `app.module.ts` : 전역 모듈, TypeORM/Config 모듈 및 주요 feature module 등록
  - `users/`, `diaries/`, `tags/`, `chat-messages/`, `chat-sessions/`, `schedules/`, `user-passwords/` : 각 도메인별 모듈 및 엔티티
- 도커 및 환경설정
  - `docker-compose.*.yaml`, `dockerfile.*`, `.env` 등

더 많은 구조는 [폴더 구조 바로보기](https://github.com/QnoteAITeam/nestjs-api-server/tree/main/)에서 확인할 수 있습니다.

---

## 기술 스택 및 환경

- **Framework:** NestJS
- **Database:** MySQL (TypeORM 사용)
- **환경변수:** dotenv 및 ConfigModule을 통한 관리
- **Swagger:** API 문서 자동 생성 및 제공 (`/api` 엔드포인트)
- **테스트:** Jest

---

## TypeORM 연결 방식

TypeORM은 `app.module.ts`에서 아래와 같이 설정됩니다.

- 환경변수 기반으로 DB 정보 주입
- 엔티티 자동 로드: `entities: [__dirname + '/**/*.entity{.ts,.js}']`
- 마이그레이션 및 동기화 지원 (`synchronize: true`, 개발환경에서만 권장)
- 예시:
  ```typescript
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DB_DOCKER_NAME,
    port: parseInt(process.env.DB_PORT!),
    username: 'root',
    password: process.env.DB_ROOT_PW,
    database: process.env.DB_NAME,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  })
  ```

---
## API 문서

- Swagger 기반의 자동 문서화(`localhost:3000/api`)
- JWT Bearer 인증 방식 지원

---

## 실행 방법 (요약)
1. 의존성 설치
   ```bash
   npm install
   ```
2. 환경변수(.env) 설정
3. 서버 실행
   ```bash
   npm run start:dev
   ```
4. [API 문서 보기](http://localhost:3000/api)

---

## 기타

- 코드 스타일: ESLint, Prettier 적용
- Docker/Docker Compose 지원
- 테스트 코드: `/test` 디렉토리

---

## ✨ 주요 API 엔드포인트

> 대부분의 엔드포인트는 JWT 인증이 필요하며, Swagger 문서(/api)에서 상세 스펙을 확인할 수 있습니다.

### 1. Auth (인증)
- `POST /auth/login` : 이메일+비밀번호 로그인 (Access/Refresh Token 발급)
- `POST /auth/restore` : refreshToken으로 accessToken 재발급
- `POST /auth/oauth` : OAuth 로그인 (Google 등)
- `GET /auth/profile` : 내 프로필 정보 조회 (JWT 필요)
- `POST /auth/register` : 회원가입

### 2. User (사용자)
- `GET /users` : 전체 유저 목록 조회 (관리자용)
- `GET /users/my` : 내 정보 조회 (JWT 필요)

### 3. Diary (일기)
- `POST /diaries` : 일기 생성
- `GET /diaries` : 내 일기 목록 조회 (페이징)
- `GET /diaries/recent` : 최근 N개의 일기 조회
- `GET /diaries/recent/one` : 가장 최근 일기 조회
- `GET /diaries/:id` : 특정 일기 상세 조회
- `PUT /diaries/:id` : 일기 수정
- `DELETE /diaries/:id` : 일기 삭제

### 4. Schedule (일정)
- `GET /schedules` : 내 일정 전체 조회
- `GET /schedules/:id` : 일정 단건 조회
- `POST /schedules` : 일정 생성
- `PUT /schedules/:id` : 일정 수정
- `DELETE /schedules/:id` : 일정 삭제

### 5. AI/Chat (OpenAI 연동)
- `POST /openai/send-message` : 챗봇(AI)에게 메시지 전송, 답변 받기
- `POST /openai/metadata` : 일기 내용 기반 메타데이터(감정 등) 추출
- `POST /openai/summary/content` : 일기 요약 생성
- `GET /openai/predict/recent` : 최근 세션 기반 예측 응답

### 6. ChatSession (챗 세션)
- `GET /sessions/recent` : 최근 챗 세션 목록 조회

---

## 🔑 Auth(인증) 시스템 요약

- **방식**: JWT 기반 (Access, Refresh Token), Passport.js(Local, JWT), OAuth(Google 등)
- **AccessToken**: 3시간 유효, Bearer 방식으로 전달
- **RefreshToken**: 7일 유효, accessToken 재발급에 사용
- **비밀번호 암호화**: bcrypt 사용, SALT 적용
- **주요 로직**
    - 회원가입/로그인 시 비밀번호 검증 및 JWT 토큰 발급
    - 모든 인증이 필요한 API에서 JwtAuthGuard 적용
    - 토큰 만료/오류시 적절한 에러 메시지 반환
    - OAuth 로그인(구글 등) 지원, 외부 토큰 검증 후 자체 토큰 발급

```typescript
// Auth Module (일부 예시)
JwtModule.register({
  secret: process.env.JWT_SECRET_KEY,
  signOptions: { expiresIn: '3h' },
});
```
```typescript
// JWT Strategy (일부 예시)
super({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY!,
});
```

- **관련 파일**
    - `src/auth/auth.module.ts`
    - `src/auth/auth.service.ts`
    - `src/auth/jwt.strategy.ts`
    - `src/users/user.entity.ts`, `src/user-passwords/user-password.entity.ts`

---

## 최근 데이터 베이스 관계도

![image](https://github.com/user-attachments/assets/5866f3c7-235e-4969-b795-67c28a23af2d)

---

## 🔍 참고

- [Swagger API 문서](https://qnote.anacnu.kr/api)
- [엔티티 및 서비스 코드 전체 보기](https://github.com/QnoteAITeam/nestjs-api-server/search?q=controller)
- 더 많은 엔드포인트/상세 코드는 `/src/*/*.controller.ts`, `/src/auth/` 등에서 확인 가능
- [폴더 구조 및 파일 전체 보기](https://github.com/QnoteAITeam/nestjs-api-server/tree/main/)
- [엔티티 코드 전체 보기](https://github.com/QnoteAITeam/nestjs-api-server/search?q=entity)

> 본 요약은 대표 API와 인증 로직을 중심으로 정리되었습니다.  
> 더 다양한 기능 및 세부 구현은 코드와 Swagger 문서를 참고해 주세요.
