// This file is created by egg-ts-helper@1.34.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportUser from '../../../app/controller/User';

declare module 'egg' {
  interface IController {
    user: ExportUser;
  }
}
