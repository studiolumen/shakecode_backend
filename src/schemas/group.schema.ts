import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { ClassProblem } from "./problem.schema";
import { User } from "./user.schema";

@Entity()
export class Classroom {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { unique: true })
  name: string;

  @Column()
  description: string;

  @OneToMany(() => ClassUser, (classUser) => classUser.classroom)
  classUser: ClassUser[];

  @OneToMany(() => ClassProblem, (classProblem) => classProblem.classroom)
  problem: ClassProblem[];
}

@Entity()
export class ClassUser {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  nickname: string;

  @Column()
  permission: string;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.classUser, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    eager: true,
  })
  user: User;

  @JoinColumn()
  @ManyToOne(() => Classroom, (classroom) => classroom.classUser, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    eager: true,
  })
  classroom: Classroom;
}
