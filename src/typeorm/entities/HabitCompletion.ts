import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Habit } from "./Habit";
import { User } from "./User";

@Entity({
  name: "habit_completions",
})
export class HabitCompletion extends BaseEntity {
  @Column("varchar", { length: 36 })
  habit_id: string;

  @Column("varchar", { length: 36 })
  user_id: string;

  @Column("date")
  date: string;

  @Column("int", { default: 0 })
  count: number;

  @Column("datetime")
  completed_at: Date;

  // Relations
  @ManyToOne(() => Habit, (habit) => habit.habit_completions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "habit_id" })
  habit: Habit;

  @ManyToOne(() => User, (user) => user.habit_completions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;
}
