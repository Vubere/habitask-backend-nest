import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";


@Entity({
  name: 'reminders',
})
export class Reminder extends BaseEntity {
  @Column('varchar', { length: 100 })
  title: string;

  @Column('varchar', { length: 500 })
  description: string;

  @Column('varchar', { length: 255 })
  purpose: string;

  @Column('varchar', { length: 50 })
  category: string;

  @Column('varchar', { length: 50 })
  trigger: string;

  @Column('varchar', { length: 50 })
  trigger_value: string;

  @Column('varchar', { length: 50, nullable: true })
  trigger_interval_unit: string;

  @Column('varchar', { length: 50, nullable: true })
  source: string;

  @Column('varchar', { length: 50, nullable: true })
  source_id: string;

  @Column('varchar', { length: 50, nullable: true })
  source_field: string;

  @Column('varchar', { length: 50, nullable: true })
  source_field_type: string;

  @Column('varchar', { length: 50 })
  user_id: string;

  @Column('boolean', { default: false })
  is_read: boolean;


  //Relations
  @ManyToOne(() => User, user => user.reminders, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({name: 'user_id'})
  user: User;
}