import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
// import { User as GraphqlUser, UserType } from '../graphql/schema.types'

@Entity()
export class Work extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  // @CreateDateColumn()
  // timeCreated: Date

  // @UpdateDateColumn()
  // timeUpdated: Date
  @Column({ nullable: true })
  userID: number

  @Column({
    length: 100,
  })
  title: string

  @Column({
    length: 100,
  })
  summary: string

  @Column({
    length: 100,
  })
  dateCreated: string
  @Column({
    length: 100,
  })
  dateModified: string
  // summary: String!

  // chapters: [Chapter]!

  // @Column({
  //   type: 'enum',
  //   enum: UserType,
  //   default: UserType.User,
  // })
  // userType: UserType

  // @Column({
  //   length: 100,
  //   nullable: true,
  // })
  // name: string

}
