// This file is created by egg-ts-helper@1.34.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportError from '../../../app/middleware/error';
import ExportLogger from '../../../app/middleware/logger';

declare module 'egg' {
  interface IMiddleware {
    error: typeof ExportError;
    logger: typeof ExportLogger;
  }
}
