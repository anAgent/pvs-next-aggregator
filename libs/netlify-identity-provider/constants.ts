import { User } from 'gotrue-js';

export interface IdentityContextState {
  login: (
    username: string,
    password: string,
    rememberMe: boolean
  ) => Promise<User | { error: string }>;
  user: User;
  confirm: (token: string, remember?: boolean) => Promise<User>;
  acceptInvite: (
    token: string,
    password: string,
    remember?: boolean
  ) => Promise<User>;
  signup(email: string, password: string, data?: any): Promise<User>;
  verify(type: string, token: string, remember?: boolean): Promise<User>;
  inProgress: boolean;
  tokenExpired: boolean;
  // the number of minutes before the token expires
  expiresIn: number;
}
