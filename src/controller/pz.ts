import { Inject, Controller, Provide, Get } from '@midwayjs/decorator';
import { Context } from 'egg';
import * as path from 'path';
import { K8sService } from '../service/k8s'

@Provide()
@Controller('/api/pz', { sensitive: true, description: '/api/pz', tagName: '流水线' })
export class Pz {
    @Inject()
    ctx: Context

    @Inject()
    k8sService: K8sService

    @Get('/yaml2js', { summary: '' })
    async yaml2js () {
        let {
            name,
            namespace,
            appId,
            annotations,
            labels,
            params
        } = this.ctx.query
        let ann: {[key:string]: string } = {}
        let labs: { [key:string]: string } = {}
        let pars: {
            name: string
            value: string
        }[] = []
        try {
            ann = JSON.parse(annotations) ?? {}
        } catch (error) {
            ann = {}
        }

        try {
            labs = JSON.parse(labels) ?? {}
        } catch (error) {
            labs = {}
        }

        try {
           pars = JSON.parse(params) ?? [] 
        } catch (error) {
           pars = []
        }

        let data = await this.k8sService.yaml2js(path.resolve(__dirname, '../../tekton/deploy.yaml'), {
            
        }, {
            name,
            namespace,
            appId,
            annotations: ann,
            labels: labs,
            params: pars
        })
        this.ctx.body = {
            code: 0,
            data
        }
    }

    @Get('/getLog', { summary: '获取pod容器日志'})
    async deploy (ctx: Context) {
        let {
            podName,
            ...restQuery
        } = this.ctx.query
        let data = await this.k8sService.getLog(podName, restQuery)
        ctx.body = {
            code: 0,
            data
        }
    }
}