import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Work } from "./Work"

@Entity()
export class Chapter extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  // @Column({ nullable: false })
  // NOTE: no longer needed this once we added the many to one relations in the chapter.ts file because having a work attached to it already creates a workid field
  // workID: number

  @Column({
    length: 100,
  })
  title: string

  @Column({
    length: 100,
  })
  text: string

  @CreateDateColumn()
  timeCreated: Date

  @UpdateDateColumn()
  timeUpdated: Date

  @ManyToOne(() => Work, work => work.chapters)
  work: Work
}
