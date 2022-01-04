import { EntityModel } from '@midwayjs/orm'
import { Column, PrimaryGeneratedColumn } from 'typeorm'

@EntityModel('app')
export class App {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 20,
    type: 'varchar'
  })
  name: string

  @Column({
    length: 20,
    type: 'varchar'
  })
  registry: string

  @Column({
    length: 20,
    type: 'varchar'
  })
  repoName: string

  @Column({
    length: 20,
    type: 'varchar'
  })
  type: string
}