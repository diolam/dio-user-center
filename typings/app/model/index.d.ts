// This file is created by egg-ts-helper@1.34.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportDtoUserRequest from '../../../app/model/dto/UserRequest';
import ExportDtoUserResponse from '../../../app/model/dto/UserResponse';
import ExportEntityUser from '../../../app/model/entity/User';
import ExportEntityUserPayload from '../../../app/model/entity/UserPayload';

declare module 'egg' {
  interface IModel {
    Dto: {
      UserRequest: ReturnType<typeof ExportDtoUserRequest>;
      UserResponse: ReturnType<typeof ExportDtoUserResponse>;
    }
    Entity: {
      User: ReturnType<typeof ExportEntityUser>;
      UserPayload: ReturnType<typeof ExportEntityUserPayload>;
    }
  }
}
