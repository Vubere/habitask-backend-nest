import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Task } from "./Task";

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

  @Column('varchar', { length: 100 })
  token: string;

  @Column('datetime')
  token_expiry: Date;

  @Column('boolean')
  is_admin: boolean;

  @Column('boolean')
  is_active: boolean;

  @Column('varchar', { length: 50 })
  profession: string;

  @Column('varchar', { length: 500 })
  bio: string;

  @OneToMany(() => Task, task => task.user)
  tasks: Task[];
}