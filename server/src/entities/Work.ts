import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Bookmark } from './Bookmark'
import { Chapter } from './Chapter'
import { User } from './User'

@Entity()
export class Work extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  // @Column({ nullable: true })
  // NOTE: no longer needed this once we added the many to one relations in the work.ts file because having a User attached to it already creates a userid field
  // userID: number

  @Column({
    length: 100,
  })
  title: string

  @Column({
    length: 1000,
  })
  summary: string

  // TODO: figure out how to query the timeCreated and the timeUpdated bc as of now I cannot figure a way to do it from the localhost:3000/graphql endpoint
  @CreateDateColumn()
  timeCreated: Date

  @UpdateDateColumn()
  timeUpdated: Date

  @Column()
  userId: number

  @ManyToOne(() => User, user => user.works)
  user: User

  @OneToMany(() => Chapter, chapter => chapter.work)
  chapters: Chapter[]

  @OneToMany(() => Bookmark, bookmark => bookmark.work)
  bookmarks: Bookmark[]
}
