export interface IEmail {
  email: string;
}

export interface IEmailandPassword {
  email: string;
  password: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IPayLoad {
  sub: string;
  name: string;
  provider: 'kakao' | 'google' | 'local';
}

export interface IID {
  id: string;
}

export interface IRefreshToken {
  refreshToken: string;
}
