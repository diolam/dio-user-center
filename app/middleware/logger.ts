import { EggContext, Next } from '@eggjs/tegg';
import { EggAppConfig } from 'egg';
import { STATUS_CODES } from 'http';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function(_, app: EggAppConfig) {
  app.coreLogger.info('[middleware] logger loaded');
  return async function(ctx: EggContext, next: Next) {
    ctx.logger.debug(`--> ${ctx.method} ${ctx.URL}`);
    ctx.logger.debug(`--> body: ${JSON.stringify(ctx.request.body)}`);
    await next();
    ctx.logger.debug(`<-- ${ctx.status} ${STATUS_CODES[ctx.status]}`);
    ctx.logger.debug(`<-- ${JSON.stringify(ctx.response.body)}`);
  };
}
