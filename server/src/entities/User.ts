import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User as GraphqlUser, UserType } from '../graphql/schema.types'
import { Bookmark } from './Bookmark'
import { Work } from './Work'

@Entity()
export class User extends BaseEntity implements GraphqlUser {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  timeCreated: Date

  @UpdateDateColumn()
  timeUpdated: Date

  @Column({
    length: 100,
  })
  email: string

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.User,
  })
  userType: UserType

  @Column({
    length: 100,
    nullable: true,
  })
  name: string

  @OneToMany(() => Work, work => work.user, { eager: true })
  works: Work[]

  @OneToMany(() => Bookmark, bookmark => bookmark.user, { eager: true })
  bookmarks: Bookmark[]
}
