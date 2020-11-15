import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'
import { Work } from './Work'

@Entity()
export class Bookmark extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  // @Column({ nullable: true })
  // NOTE: no longer needed this once we added the many to one relations in the work.ts file because having a User attached to it already creates a userid field
  // userID: number

  @ManyToOne(() => User, user => user.bookmarks)
  user: User

  @ManyToOne(() => Work, work => work.bookmarks)
  work: Work
}
