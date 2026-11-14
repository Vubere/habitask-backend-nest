import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { BaseEntity } from "./BaseEntity";

export type TaskStatus = "todo" | "done";

export type Subtask = {
  id: string;
  title: string;
  done: boolean;
};

@Entity({
  name: "tasks",
})
export class Task extends BaseEntity {
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

  @Column("varchar", { length: 10, default: "todo" })
  status: TaskStatus;

  @Column("date", { nullable: true })
  due_date: string | null;

  // "HH:mm"
  @Column("varchar", { length: 5, nullable: true })
  due_time: string | null;

  @Column("varchar", { length: 10, default: "none" })
  priority: string;

  @Column("json", { nullable: true })
  subtasks: Subtask[];

  @Column("datetime", { nullable: true })
  completed_at: Date | null;

  @ManyToOne(() => User, (user) => user.tasks, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;
}
