export enum Gender {
  keepSecret, male, female
}

export enum UserStatus {
  available, banned, admin
}

export interface User {
  id?: number;
  name?: string;
  username?: string;
  password?: string;
  salt?: string;
  gender?: Gender;
  userStatus?: UserStatus;
  createTime?: Date;
  updateTime?: Date;
  idDeleted?: boolean;
}
