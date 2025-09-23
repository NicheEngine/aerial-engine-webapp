declare module 'login-api' {
  export * from './api';
  export * from './index';

  export interface PasswordBody {
    account: string;
    password: string;
  }

  export interface TokenBody {
    token: string;
  }
}
