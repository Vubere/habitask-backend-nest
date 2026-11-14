import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { HabitCompletion } from "./HabitCompletion";

export type FrequencyKind = "daily" | "weekdays" | "timesPerWeek";

export type Frequency =
  | { kind: "daily" }
  | { kind: "weekdays"; days: number[] }
  | { kind: "timesPerWeek"; count: number };

export type Polarity = "positive" | "negative";

@Entity({
  name: "habits",
})
export class Habit extends BaseEntity {
  @Column("varchar", { length: 100 })
  title: string;

  @Column("varchar", { length: 500, default: "" })
  notes: string;

  @Column("varchar", { length: 50, default: "circle" })
  icon: string;

  @Column("varchar", { length: 20, default: "#4F46E5" })
  color: string;

  @Column("datetime", { nullable: true })
  archived_at: Date | null;

  @Column("varchar", { length: 36 })
  user_id: string;

  @Column("varchar", { length: 20, default: "daily" })
  frequency_kind: FrequencyKind;

  // "1,3,5" for weekdays
  @Column("varchar", { length: 20, nullable: true })
  frequency_days: string | null;

  @Column("int", { nullable: true })
  frequency_count: number | null;

  @Column("date")
  start_date: string;

  @Column("int", { default: 1 })
  target_per_day: number;

  // "HH:mm"
  @Column("varchar", { length: 5, nullable: true })
  reminder_time: string | null;

  @Column("varchar", { length: 10, default: "positive" })
  polarity: Polarity;

  // Relations
  @ManyToOne(() => User, (user) => user.habits, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => HabitCompletion, (completion) => completion.habit)
  habit_completions: HabitCompletion[];
}
