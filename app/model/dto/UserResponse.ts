import { Gender, User } from '../entity/User';

export interface UserResponse extends User {
  id: number;
  name: string;
  username: string;
  gender: Gender;
  createTime: Date;
}
