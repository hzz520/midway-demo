import { EntityModel } from '@midwayjs/orm'
import { Column, PrimaryGeneratedColumn } from 'typeorm'

@EntityModel('publish_record')
export class PublishRecord {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'int'
  })
  appId: number

  @Column({
    type: 'int'
  })
  userId: number

  @Column({
    type: 'datetime'
  })
  startAt: string

  @Column({
    type: 'datetime'
  })
  endAt: string

  @Column({
    length: 20,
    type: 'varchar'
  })
  branch: string

  @Column({
    length: 30,
    type: 'varchar'
  })
  commitId: string

  @Column({
    length: 100,
    type: 'varchar'
  })
  commitMsg: string
}