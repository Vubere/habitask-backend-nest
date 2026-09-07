import { Column, Entity } from "typeorm";
import { BaseEntity } from "./BaseEntity";

export const NotificationSourceEnum = ['habit', 'habit-action', 'task', 'task_step'] as const;

@Entity({
  name: 'notifications',
})
export class Notification extends BaseEntity {
  @Column('varchar', { length: 100 })
  title: string;

  @Column('varchar', { length: 500 })
  description: string;

  @Column('varchar', { length: 50 })
  category: string;

  @Column('datetime')
  date: Date;

  @Column('boolean', { default: false })
  is_read: boolean;

  @Column({type:'enum', enum: NotificationSourceEnum, default: 'habit'})
  source: string;

  @Column('varchar', { length: 50 })
  source_id: string;

  @Column('varchar', { length: 50 })
  user_id: string;
}
