import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web'
import { Provide, Config } from '@midwayjs/decorator'

import { Context } from 'egg';
import { TokenHandlerConfig, IgnoreItem } from '../interface';
import { isRegExp, isString } from 'lodash';
import { User } from '../entity/user'
import { InjectEntityModel } from '@midwayjs/orm'
import { Repository } from 'typeorm'

@Provide()
export class TokenHandlerMiddleware implements IWebMiddleware {
    @Config('tokenHandler')
    tokenHandlerConfig: TokenHandlerConfig

    @InjectEntityModel('user')
    userModel: Repository<User>;

    resolve() {
        return async (ctx: Context, next: IMidwayWebNext) => {
            let { ignore } = this.tokenHandlerConfig
            let arr: IgnoreItem[] = Array.isArray(ignore) ? ignore : [ignore]
            let flag = arr.some(ignoreItem => {
                if (isRegExp(ignoreItem)) {
                    return ignoreItem.test(ctx.request.path)
                }

                if (isString(ignoreItem)) {
                    return ctx.request.path === ignoreItem
                }

                return ignoreItem(ctx)
            })
            if (flag) {
                await next()
                return
            }
            try {
                let token: any = ctx.app.jwt.verify(ctx.cookies.get('access_token'), ctx.app.config.jwt.secret)
                
                try {
                    if (token.name) {
                        let user = await this.userModel.find({
                            name: token.name
                        })
                        user.length && ctx.request.response.set('userInfo', JSON.stringify({
                            name: user[0].name,
                            id: user[0].id
                        }))
                    }
                    
                } catch (error) {
                
                }
            } catch (error) {
                ctx.cookies.set('access_token', null)
                ctx.body = {
                  errCode: 10001,
                  message: error.message,
                  data: {
                    loginUrl: `${ctx.headers.referer}login`
                  }
                }
                return
            }
            await next()
        }
    }
}

