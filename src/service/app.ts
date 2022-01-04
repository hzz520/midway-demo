import { App } from '../entity/app'
import { InjectEntityModel } from '@midwayjs/orm'
import { Repository } from 'typeorm'
import { Inject, Provide } from '@midwayjs/decorator'
import { Context } from 'egg'

@Provide()
export class AppService {
  @Inject()
  ctx: Context

  @InjectEntityModel('app')
  application: Repository<App>

  async getAppDetailById(id) {
    let app = await this.application.findOne(id)

    return app
  }
}
