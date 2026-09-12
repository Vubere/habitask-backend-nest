import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Task } from "./Task";
import { Reminder } from "./Reminder";
import { TaskStep } from "./TaskStep";
import { Habit } from "./Habit";
import { Notification } from "./Notification";
import { HabitOccurence } from "./HabitOccurence";
import { HabitAction } from "./HabitAction";

@Entity({
  name: 'users',
})
export class User extends BaseEntity {
  @Column('varchar', { length: 50 })
  first_name: string;

  @Column('varchar', { length: 50 })
  last_name: string;

  @Column('varchar', { length: 100, unique: true })
  username: string;

  @Column('varchar', { length: 100 })
  email: string;

  @Column('varchar', { length: 100 })
  password: string;

  @Column('varchar', { length: 100, nullable: true })
  token: string;

  @Column('datetime', { nullable: true })
  token_expiry: Date;

  @Column('boolean', {default: false})
  is_admin: boolean;

  @Column('boolean', {default: true})
  is_active: boolean;

  @Column('varchar', { length: 50, nullable: true })
  profession: string;

  @Column('varchar', { length: 500, default: "" })
  bio: string;

  //Relations
  @OneToMany(() => Task, task => task.user)
  tasks: Task[];

  @OneToMany(() => Reminder, reminder => reminder.user)
  reminders: Reminder[];

  @OneToMany(() => TaskStep, taskStep => taskStep.user)
  task_steps: TaskStep[];

  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];

  @OneToMany(() => Habit, habit => habit.user)
  habits: Habit[];

  @OneToMany(() => HabitOccurence, habitOccurence => habitOccurence.user)
  habit_occurences: HabitOccurence[];

  @OneToMany(() => HabitAction, habitAction => habitAction.user)
  habit_actions: HabitAction[];
}