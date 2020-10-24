import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
// import { User as GraphqlUser, UserType } from '../graphql/schema.types'

@Entity()
export class Chapter extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  // @CreateDateColumn()
  // timeCreated: Date

  // @UpdateDateColumn()
  // timeUpdated: Date
  @Column({ nullable: false })
  workID: number

  @Column({ nullable: false })
  chapterID: number

  @Column({ nullable: false })
  userID: number

  @Column({
    length: 100,
  })
  title: string

  @Column({
    length: 100,
  })
  text: string

  @Column({
    length: 100,
  })
  dateCreated: string

  @Column({
    length: 100,
  })
  dateModified: string


}
