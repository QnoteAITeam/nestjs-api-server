# nest-auth-docker

NestJS 기반 인증 서버 프로젝트입니다. 자체 로그인(LocalStrategy)과 OAuth 로그인 방식(Google 등)을 지원하며, JWT 기반 인증 및 리프레시 토큰 발급을 구현하였습니다. MySQL과의 연동은 Docker-Compose 환경에서 관리됩니다.

## 🛠 기술 스택

- **백엔드 프레임워크**: NestJS (TypeScript)
- **인증 및 보안**:
  - Passport.js (Local, JWT)
  - JWT Access / Refresh Token
  - Bcrypt 해시 암호화
- **데이터베이스**: MySQL (Docker-Compose로 관리)
- **ORM**: TypeORM
- **컨테이너 환경**: Docker, Docker-Compose
- **배포/버전 관리**: Git

## 🔐 기능 설명

### ✅ 자체 로그인
- 이메일 + 비밀번호 조합
- 비밀번호는 Bcrypt로 해시화 저장
- 성공 시 accessToken 및 refreshToken 발급

### ✅ JWT 인증
- Access Token: 3시간 유효
- Refresh Token: 요청 시 Access Token 재발급
- JWT 검증 실패 시 오류 메시지 반환

### ✅ OAuth 로그인
- Flutter 등 클라이언트가 OAuth로 받은 accessToken 전달
- 서버에서 검증 후 자체 accessToken 발급

---

현재 아래와 같이, Docker Network를 이용해, 연동하고, 값을 넣고 뺄 수 있게 연동해놓았음.

![image](https://github.com/user-attachments/assets/5a759c28-0cd8-4142-b305-9452063aa638)


## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
