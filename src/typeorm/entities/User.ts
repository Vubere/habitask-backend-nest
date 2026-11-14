import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Task } from "./Task";
import { Habit } from "./Habit";
import { Notification } from "./Notification";
import { HabitCompletion } from "./HabitCompletion";

@Entity({
  name: "users",
})
export class User extends BaseEntity {
  @Column("varchar", { length: 50 })
  first_name: string;

  @Column("varchar", { length: 50 })
  last_name: string;

  @Column("varchar", { length: 100, unique: true })
  username: string;

  @Column("varchar", { length: 100 })
  email: string;

  @Column("varchar", { length: 100 })
  password: string;

  @Column("varchar", { length: 100, nullable: true })
  token: string;

  @Column("datetime", { nullable: true })
  token_expiry: Date;

  @Column("boolean", { default: false })
  is_admin: boolean;

  @Column("boolean", { default: true })
  is_active: boolean;

  @Column("varchar", { length: 50, nullable: true })
  profession: string;

  @Column("varchar", { length: 500, default: "" })
  bio: string;

  // Relations
  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Habit, (habit) => habit.user)
  habits: Habit[];

  @OneToMany(() => HabitCompletion, (completion) => completion.user)
  habit_completions: HabitCompletion[];
}
