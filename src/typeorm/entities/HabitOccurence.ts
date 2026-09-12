import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Habit } from "./Habit";
import { User } from "./User";

@Entity({
  name: 'habit_occurences',
})
export class HabitOccurence extends BaseEntity {
  @Column('datetime', { nullable: false })
  date: Date;

  @Column('varchar', { length: 36 })
  habit_id: string;

  @Column('varchar', { length: 36 })
  user_id: string;

  //Relations
  @ManyToOne(() => Habit, habit => habit.habit_occurences, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @Column({type: 'varchar', length: 50})
  habit: Habit;
  
  @ManyToOne(() => User, user => user.habit_occurences, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @Column({type: 'varchar', length: 50})  
  user: User;
}