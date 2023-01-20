import { Gender, User } from '../entity/User';

export interface UserRequest extends User {
  name: string;
  username: string;
  gender: Gender;
}
