/* eslint-disable @typescript-eslint/ban-ts-comment */
import { EggContext, Next } from '@eggjs/tegg';
import { ClientErrorResponse } from 'egg';

export default function(_, app) {
  app.coreLogger.info('[middleware] error loaded');
  return async function(ctx: EggContext, next: Next) {
    try {
      await next();
    } catch (e) {
      const err = e as ClientErrorResponse;
      const status = err.status;
      if (!status || status === 500) {
        ctx.app.emit('error', err);
        ctx.status = 500;
        ctx.body = { message: 'internal server error' };
        return;
      }
      // @ts-ignore
      ctx.body = { message: err.message };
      ctx.status = status;
    }
  };
}
