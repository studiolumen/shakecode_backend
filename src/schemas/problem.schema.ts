import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { ProblemCategory } from "../common/types";

import { Classroom } from "./group.schema";
import { User } from "./user.schema";

@Entity()
export class Problem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { unique: true })
  name: string = null;

  @Column()
  description: string = null;

  @Column()
  category: ProblemCategory = null;

  @Column()
  difficulty: number = null;

  /**
   * unit: milliseconds
   */
  @Column()
  time_limit: number = null;

  /**
   * unit: megabytes
   */
  @Column()
  memory_limit: number = null;

  @Column()
  restricted: number = null;

  @JoinColumn()
  @OneToMany(() => TestCase, (testCase) => testCase.problem, { eager: true })
  testCases: TestCase[];

  @OneToMany(() => PublicProblem, (publicProblem) => publicProblem.problem)
  publicProblem: TestCase[];

  @OneToMany(() => ClassProblem, (classProblem) => classProblem.problem)
  classProblem: TestCase[];

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.problem, { eager: true })
  user: User;
}

@Entity()
export class TestCase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  input: string = null;

  @Column()
  output: string = null;

  @Column()
  show_user: boolean = null;

  @JoinColumn()
  @ManyToOne(() => Problem, (problem) => problem.testCases, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  problem: Problem;
}

@Entity()
export class PublicProblem {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => Problem, (problem) => problem.publicProblem, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    eager: true,
  })
  problem: Problem;
}
@Entity()
export class ClassProblem {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => Problem, (problem) => problem.classProblem, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    eager: true,
  })
  problem: Problem;

  @JoinColumn()
  @ManyToOne(() => Classroom, (classroom) => classroom.problem, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    eager: true,
  })
  classroom: Classroom;
}
