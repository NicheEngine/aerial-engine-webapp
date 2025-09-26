declare module 'login-api' {
  import type { UserModel } from 'user-api';

  export interface PasswordBody {
    username?: string;
    password?: string;
  }

  export interface TokenBody {
    token: string;
  }

  export interface LoginResult {
    token: string;
    userId: string;
    user: UserModel;
  }
}
