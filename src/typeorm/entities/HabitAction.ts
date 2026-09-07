import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Habit } from "./Habit";
import { User } from "./User";
import { BaseEntity } from "./BaseEntity";


@Entity({
  name: 'habit_actions',
})
export class HabitAction extends BaseEntity {
 @Column('varchar', { length: 100 })
 title: string;

 @Column('varchar', { length: 500 })
 description: string;

 @Column('varchar', { length: 50 })
 category: string;

 @Column('float64', { default: 0 })
 cost_incurred: number;

 @Column('boolean', { default: false, nullable: true })
 is_positive: boolean;

 @Column('varchar', { length: 50 })
 habit_id: string;

 @Column('varchar', { length: 50 })
 user_id: string;

 //Relations
 @ManyToOne(() => Habit, habit => habit.habit_actions, {
   onDelete: 'CASCADE',
   eager: true,
 })
 @JoinColumn({name: 'habit_id'})
 habit: Habit;

 @ManyToOne(() => User, user => user.habit_actions, {
   onDelete: 'CASCADE',
   eager: true,
 })
 @JoinColumn({name: 'user_id'})
 user: User;
}