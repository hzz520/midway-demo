import { Inject, Controller, Provide, Query, Get } from '@midwayjs/decorator';
import { Context } from 'egg';
import { IGetUserResponse } from '../interface';
import { UserService } from '../service/user';
import * as querystring from 'querystring'

@Provide()
@Controller('/user')
export class Login {
  @Inject()
  ctx: Context

  @Get('/login')
  async login (ctx: Context) {
    let token = ctx.app.jwt.sign({
      ...ctx.request.query
    }, ctx.app.config.jwt.secret, {
      expiresIn: '2m'
    })

    return {
      code: 0,
      message: 'ok',
      token
    }
  }

  @Get('/info')
  async info (ctx: Context) {
    try {
      let token = ctx.app.jwt.verify(ctx.query.token, ctx.app.config.jwt.secret)

      console.log('token', token);
    } catch (error) {
      console.log('');
      ctx.status = 500
      // ctx.body = {
      //   code: 200,
      //   message: 'token 过期'
      // }
      return
    }
    

    ctx.body = '111'
  }
}

@Provide()
@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Get('/get_user')
  async getUser(@Query() uid: string): Promise<IGetUserResponse> {
    
    const user = await this.userService.getUser({ uid });
    return { success: true, message: 'OK', data: user };
  }
}

@Provide()
@Controller('/github')
export class GithubController {
  @Inject()
  ctx: Context

  @Get('/login')
  async login (ctx: Context) {
    let path = 'https://github.com/login/oauth/authorize?client_id=' + ctx.app.config.github.client_id
    ctx.redirect(path)
  }

  @Get('/callback')
  async getCb (ctx: Context): Promise<any> {
    const params = {
      ...ctx.app.config.github,
      code: ctx.query.code
    }
    
    let access_token = await ctx.curl('https://github.com/login/oauth/access_token', {
      method: 'POST',
      data: params
    }).then(async res => {
      try {
        let { access_token } = querystring.parse(Buffer.from(res.data, 'binary').toString('utf-8'))
      
      
        return access_token
      } catch (error) {
        return ''
      }
    }).catch((error) => {
      console.log('error', error);
      
    })

    let res = await ctx.curl(`https://api.github.com/user`, {
      method: 'GET',
    headers: {
      'Authorization': 'token ' + access_token
    },
  }).then(async res => {
    // console.log(Buffer.from(res.data, 'binary').toString('utf-8'));
    
    try {
      return JSON.parse(Buffer.from(res.data, 'binary').toString('utf-8'))
    } catch (error) {
      console.log('error', error);
      
      return {}
    }
  }).catch((error) => {
    console.log('error', error);
    
  })

  if (res.documentation_url) {
    let path = 'https://github.com/login/oauth/authorize?client_id=' + ctx.app.config.github.client_id
    ctx.redirect(path)
    return false
  }
  
    
    ctx.body = {
      code: 0,
      message: 'success',
      data: res
    }
  }
}
