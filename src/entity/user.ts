import { EntityModel } from '@midwayjs/orm'
import { Column, PrimaryGeneratedColumn } from 'typeorm'

@EntityModel('user')
export class User {
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
  password: string
}