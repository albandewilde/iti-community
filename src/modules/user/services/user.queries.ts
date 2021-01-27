import { Injectable } from '@angular/core';
import { User, UserRegistration } from '../user.model';

@Injectable()
export abstract class UserQueries {
  abstract getAllUsers(): Array<User>;
  abstract getUserInfo(): Promise<User>;
  abstract search(search: string): Promise<User[]>;
  abstract exists(username: string): Promise<boolean>;
}
