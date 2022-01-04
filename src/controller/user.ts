import { Inject, Controller, Provide, Get, Post } from '@midwayjs/decorator';
import { Context } from 'egg';
import { CreateApiDoc } from '@midwayjs/swagger'
import { User } from '../entity/user'
import { InjectEntityModel } from '@midwayjs/orm'
import { Repository } from 'typeorm'
import { QueueService } from '@midwayjs/task'
import { HelloTask } from '../task/hello'

@Provide()
@Controller('/api/user', { sensitive: true, description: '/api/user', tagName: '用户' })
export class Login {

  @Inject()
  ctx: Context

  @Inject()
  queueService: QueueService;

  @InjectEntityModel('user')
  userModel: Repository<User>;

  @CreateApiDoc()
  .build()
  @Post('/login', {
    summary: '登录',
    description: '用户登录'
  })
  async login (ctx: Context) {
    try {
      await ctx.validate({
        name: {
          type: 'string',
          allowEmpty: false,
          required: true
        },
        password: {
          type: 'string',
          allowEmpty: false,
          required: true
        }
      }, ctx.request.body)

      let user =  await this.userModel.findOne(ctx.request.body)
    
      if (user) {
        let token = ctx.app.jwt.sign({
          ...ctx.request.body
        }, ctx.app.config.jwt.secret, {
          expiresIn: '1440m'
        })
    
        ctx.cookies.set('access_token', token)
    
        ctx.body = {
          code: 0,
          message: 'ok'
        }
      } else {
        ctx.body = {
          code: 500,
          message: '用户未注册'
        }
      }
    } catch (error) {
      let { message, field, code } = error.errors[0]
      ctx.body = {
        code: 500,
        message: `${code} ${field} ${message}`
      }
    }
    
  }

  @Get('/logout', { summary: '退出登录', description: '用户退出登录' })
  async logout (ctx: Context) {
    ctx.cookies.set('access_token', null)

    // ctx.redirect(`${ctx.headers.referer}login`)
    const headers = {    
      Location: `${ctx.headers.referer}login`,   
      'Content-Type': 'text/html; charset=utf-8' 
   }  
  ctx.status = 302 
  ctx.set(headers)
  }

  @Post('/registry', { summary: '注册', description: '注册用户' })
  async registry (ctx: Context) {
    try {
      await this.ctx.validate({
        name: {
          type: 'string',
          allowEmpty: false,
          required: true
        },
        password: {
          type: 'string',
          allowEmpty: false,
          required: true
        },
        confirmPassword: {
          type: 'string',
          allowEmpty: false,
          required: true
        }
      }, ctx.request.body)
      

      if (ctx.request.body.password !== ctx.request.body.confirmPassword) {
        throw new Error("两次密码不一致");
        
      }

      let {
        name,
        password
      } = ctx.request.body

      await this.userModel.insert({
        name,
        password
      })
  
      ctx.body = {
        code: 0,
        message: 'ok'
      }
    } catch (error) {
      if (!error.errors) {
        let { message } = error
        ctx.body = {
          code: 500,
          message
        }

        return
      }

      let { code, message, field } = error.errors[0]
      
      ctx.body = {
        code: 500,
        message: `${code} ${field} ${message}`
      }
    }

  }

  @Get('/infor', { summary: '用户信息', description: '获取用户信息' })
  async infor (ctx: Context) {
    try {
      // let token: any = ctx.app.jwt.verify(ctx.cookies.get('access_token'), ctx.app.config.jwt.secret)
      let data = JSON.parse(ctx.request.response.get('userInfo'))
      
      ctx.body = {
        code: 0,
        message: 'ok',
        data
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
  }

  @Get('/test')
  async getQueue() {
    let job = this.queueService.getClassQueue(HelloTask);
    job.add({
      hello: 123
    }, {
      delay: 0,
      repeat: { cron: '* * * * *' },
      removeOnComplete: true, 
    })
    
    this.ctx.body = {
      code: 111
    }
  }
  
}
