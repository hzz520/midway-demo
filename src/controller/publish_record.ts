import { Inject, Controller, Provide, Get, Post, Config } from '@midwayjs/decorator';
import { Context } from 'egg';
import { PublishRecrodService } from '../service/publish_record'; 
import { K8sService } from '../service/k8s';
import path = require('path');
import { AppService } from '../service/app';
import { K8sConfig } from '../interface';

@Provide('publish')
@Controller('/api/publish', { tagName: '发布', description: '/api/publish' })
export class Publish {
    @Config('k8s')
    k8sConfig: K8sConfig

    @Inject()
    ctx: Context

    @Inject()
    appService: AppService

    @Inject()
    publishRecrodService: PublishRecrodService

    @Inject()
    k8sService: K8sService
    
    @Post('/deploy', { summary: '发布', description: '发布应用'  })
    async deploy (ctx: Context) {
        let {
            appId,
            commitId,
            branch
        } = ctx.request.body

        let { id: userId } = JSON.parse(ctx.request.response.get('userInfo'))

        let { name, registry: gitUrl } = await this.appService.getAppDetailById(appId) ?? {}
        let taskName = `${name}-${commitId}`

        let data = await this.k8sService.yaml2js(path.resolve(__dirname, '../../tekton/deploy.yaml'), {}, {
            name: taskName,
            namespace: this.k8sConfig.namespace,
            appId: `${appId}`,
            annotations: {
                commitId,
                branch,
                userId: `${userId}`
            },
            params: [
              {
                value: gitUrl
              },
              {
                value: commitId
              },
              {
                value: `registry.cn-beijing.aliyuncs.com/hzz-harbor/${name}:${commitId}`
              }
            ]
        })

        this.k8sService.applyTask(data)
        ctx.body = {
            code: 0,
            message: 'ok'
        }
    }

    @Get('/record', { summary: '发布记录', description: '获取发布记录' })
    async getRecord (ctx: Context) {
        try {
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
            })
            let data = await this.publishRecrodService.getRecord()
            ctx.body = {
                code: 0,
                message: 'ok',
                data
            }
        } catch (error) {
            let { message, field, code } = error.errors ? error.errors[0] : error
            ctx.body = {
                code: 500,
                message: `${code} ${field} ${message}`
            }
            
        }
    }
}

