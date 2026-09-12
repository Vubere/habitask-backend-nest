import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Task } from "./Task";
import { User } from "./User";


@Entity({
  name: 'task_steps',
})
export class TaskStep extends BaseEntity {
  @Column('varchar', { length: 36 })
  task_id: string;

  
  @Column('varchar', { length: 36 })
  user_id: string;
  
  @Column('varchar', { length: 500 })
  description: string;
  
  @Column({type:'boolean', default: false, nullable: true})
  is_done: boolean;

  @Column('datetime', { nullable: true })
  done_at: Date;
  
  @Column('datetime', { nullable: true })
  time_due: Date;
  
  @Column('int', { default: 0 })
  order: number;
  
  @Column('int', { default: 0 })
  estimated_duration: number;
  
  @Column('int', { default: 0 })
  actual_duration: number;

  @ManyToOne(() => Task, task => task.task_steps, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({name: 'task_id'})
  task: Task;

  @ManyToOne(() => User, user => user.task_steps, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({name: 'user_id'})
  user: User;
}