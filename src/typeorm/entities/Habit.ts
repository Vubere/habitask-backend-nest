import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { HabitOccurence } from "./HabitOccurence";
import { HabitAction } from "./HabitAction";

@Entity({
  name: 'habits',
})
export class Habit extends BaseEntity {
  @Column('varchar', { length: 100 })
  name: string;

  @Column('varchar', { length: 500 })
  description: string;

  @Column('varchar', { length: 50 })
  category: string;

  @Column('text')
  pros: string;

  @Column('text')
  cons: string;

  @Column('varchar', { length: 50 })
  user_id: string;

  @Column('boolean', { default: false })
  is_positive: boolean;

  @Column('datetime', { nullable: true })
  last_done: Date;

  //Relations
  @ManyToOne(() => User, user => user.habits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'user_id'})
  user: User;

  @OneToMany(() => HabitOccurence, habitOccurence => habitOccurence.habit)
  habit_occurences: HabitOccurence[];

  @OneToMany(() => HabitAction, habitAction => habitAction.habit)
  habit_actions: HabitAction[];
}