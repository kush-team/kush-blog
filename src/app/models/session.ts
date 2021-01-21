import { User } from './user';

export class Session {
  public token: string;
  public user: User;
  constructor(token: string, user: User) {
    this.token = token;
    this.user = user;
  }
}
