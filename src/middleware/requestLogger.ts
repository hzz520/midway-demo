import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web'
import { Provide } from '@midwayjs/decorator'

import { Context } from 'egg';
@Provide()
export class RequestLoggerMiddleware implements IWebMiddleware {


    resolve() {
        return async (ctx: Context, next: IMidwayWebNext) => {
            await next()

            if ([ '/health' ].includes(ctx.request.path)) {
                return;
            }

            ctx.getLogger('logger').info(ctx.request.body);
        }
    }
}

