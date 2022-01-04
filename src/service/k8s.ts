import { Provide, Inject, Config } from '@midwayjs/decorator';
import { Context } from 'egg'
import { K8sConfig } from '../interface';
import { mergeWith } from 'lodash'
import { stringify } from 'querystring'
import { load, LoadOptions } from 'js-yaml'
import * as fs from 'fs'

@Provide()
export class K8sService {
  @Inject()
  ctx: Context

  @Config('k8s')
  k8sConfig: K8sConfig

  async yaml2js(str: fs.PathLike, options?: LoadOptions, data?: {
    name: string
    namespace: string
    appId: string
    serviceAccountName?: string
    labels?: {
      [key:string]: string
    }
    annotations?: {
      [key:string]: string
    }
    params?: {
      name?: string
      value: string
    }[]
  }) {
    let {
      name = '',
      namespace = '',
      appId = '',
      annotations = {},
      labels = {},
      params = [],
      serviceAccountName = "sa"
    } = data ?? {}
    let json = load(fs.readFileSync(str, { encoding: 'utf-8' }), options)
    
    mergeWith(json, {
      metadata: {
        labels: {
          appId,
          ...(labels ?? {})
        },
        annotations: annotations ?? {},
        name,
        namespace
      },
      spec: {
        serviceAccountName,
        params
      }
    })
    return JSON.stringify(json)
  }

  // async stopTask () {
  //   let {
  //     tekton,
  //     namespace,
  //     requestOptions,
  //   } = this.k8sConfig

  //   let url = `${tekton}/namespaces/${namespace}/taskruns`
  // }

  async applyTask (data) {
    let {
      tekton,
      namespace,
      requestOptions,
    } = this.k8sConfig

    let url = `${tekton}/namespaces/${namespace}/taskruns`

    this.ctx.curl(url, { ...requestOptions, data, method: 'POST'}).then(() => {
      this.ctx.logger.info(url, { ...requestOptions, data, method: 'POST'})
    }).catch((err) => {
      this.ctx.logger.info(err)
    })

    return true
  }

  async getLog(pod, query) {
    let {
       base,
       namespace,
       requestOptions,
    } = this.k8sConfig
    query = {
      timestamps: true,
      pretty: true,
      ...query
    }
    let data = await this.ctx.curl(`${base}/namespaces/${namespace}/pods/${pod}/log?${stringify(query)}`, mergeWith({}, requestOptions, {dataType: 'text'})).then(async res => {
      return res.data
    })
    return data;
  }
}
