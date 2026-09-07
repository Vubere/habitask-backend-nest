import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { User } from "./User";
import { BaseEntity } from "./BaseEntity";
import { TaskStep } from "./TaskStep";


@Entity({
  name: 'tasks',
})
export class Task extends BaseEntity {
  @Column({type: 'varchar', length: 100})
  name: string;

  @Column({type: 'varchar', length: 500})
  description: string;

  @Column({type: 'varchar', length: 50})
  category: string;
  
  @Column({type: 'boolean', default: false, nullable: true})
  is_completed: boolean;

  @Column({type: 'datetime', nullable: true})
  completed_at: Date | null;

  @Column({type: 'datetime', nullable: true})
  due_at: Date | null;

  @Column({type: 'int', default: 0})
  estimated_duration: number;

  @Column({type: 'int', default: 0})
  actual_duration: number;

  @Column('varchar', { length: 50, default: 'low' })
  priority: string;

  @Column({type: 'varchar', length: 50})
  user_id: string;

  @ManyToOne(() => User, user => user.tasks, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({name: 'user_id'})
  user: User;
  
  @OneToMany(() => TaskStep, taskStep => taskStep.task)
  task_steps: TaskStep[];
}