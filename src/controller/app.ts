import { Inject, Controller, Provide, Get, Post, Put } from '@midwayjs/decorator';
import { Context } from 'egg';
// import { CreateApiDoc } from '@midwayjs/swagger'
import { App } from '../entity/app'
import { InjectEntityModel } from '@midwayjs/orm'
import { Repository } from 'typeorm'

@Provide()
@Controller('/api/app', { sensitive: true, description: '/api/app', tagName: '应用' })
export class AppCtrl {
    @Inject()
    ctx: Context

    @InjectEntityModel('app')
    appModel: Repository<App>

    @Get('/list', { summary: '应用列表', description: '获取用户列表' })
    async getList (ctx: Context) {
        try {
            let {
                current,
                pageSize,
                ...restQuery
             } = ctx.query
            await ctx.validate({
                current: {
                    type: 'number',
                    allowEmpty: false,
                    required: false
                },
                pageSize: {
                    type: 'number',
                    allowEmpty: false,
                    required: false
                },
            }, ctx.request.query)
            
            let data = []
            let skip = ((+current || 1)- 1) * (+pageSize || 10)
            let take = +pageSize || 10
      
            let sqls = [restQuery.name ? `name like '%${restQuery.name}%'` : '', restQuery.type ? `type='${restQuery.type}'` : ''].filter(item => item !== '')

            let filter = sqls.length ? `where ${sqls.join(' and ')}` : ''
            

            let apps = await this.appModel.query(`SELECT * from app  ${filter} limit ?,?`, [skip, take])
            
            let count = await await this.appModel.query(`SELECT COUNT(*) from app ${filter} limit ?,?`, [skip, take])

            data = [apps, count]
             
           
            ctx.body = {
               code: 0,
               message: 'ok',
               data: {
                  list: data[0],
                  total: data[1],
                  current: +current || 1,
                  pageSize: +pageSize || 10
               }
           }
        } catch (error) {
            
            let { message, field, code } = error.errors ? error.errors[0] : error
            ctx.body = {
                code: 500,
                message: `${code} ${field} ${message}`
            }
        }
        // ctx.
    } 
    
    @Get('/:id', { summary: '应用详情', description: '获取应用详情' })
    @Put('/:id', { summary: '修改应用', description: '修改应用' })
    @Post('/', { summary: '新建应用', description: '新建应用' })
    async Edit (ctx: Context) {
        let {
            method,
            body,
        } = ctx.request
        try {
            switch (method.toLowerCase()) {
                case 'put':
                    await this.appModel.update(ctx.params.id, body)
                    ctx.body = {
                        code: 0,
                        message: 'ok'
                    }
                    break;
                case 'post':
                    let app = await this.appModel.findOne({
                        name: body.name
                    })
                    if (app) {
                        ctx.body = {
                            code: 500,
                            message: '应用已经存在'
                        }
                        return
                    }
                    await this.appModel.insert(body)

                    ctx.body = {
                        code: 0,
                        message: 'ok'
                    }
                    break
                case 'get':
                    let data = await this.appModel.findOne({
                        id: ctx.params.id
                    }) 

                    if (data) {
                        ctx.body = {
                            code: 0,
                            message: 'ok',
                            data
                        }
                        return
                    }
                    ctx.body = {
                        code: 500,
                        message: '应用不存在'
                    }
                default:
                    break;
            }
        } catch (error) {
            ctx.body = {
                code: 500,
                message: error.message
            }
        }
    }
}