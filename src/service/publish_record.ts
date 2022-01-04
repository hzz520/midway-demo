import { PublishRecord } from '../entity/publish_record'
import { InjectEntityModel } from '@midwayjs/orm'
import { Repository } from 'typeorm'
import { Inject, Provide } from '@midwayjs/decorator'
import { Context } from 'egg'

@Provide()
export class PublishRecrodService {
    @Inject()
    ctx: Context

    @InjectEntityModel('publish_record')
    PublishRecordModel: Repository<PublishRecord>

    async getRecord (current = 1, pageSize = 10) {
        let skip = (+current - 1) * +pageSize
        let take = +pageSize
        let [list, total] = await this.PublishRecordModel.findAndCount({
           skip,
           take
        })

        return {
            list,
            total,
            current: +current,
            pageSize: +pageSize
        }
    }
}