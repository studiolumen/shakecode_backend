import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { LoginType, LoginTypesValues } from "../common/types";

import { User } from "./user.schema";

@Entity()
export class Login {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.login, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: User;

  @Column({ enum: LoginTypesValues })
  type: LoginType;

  @Column("text")
  identifier1: string;

  @Column("text")
  identifier2: string;
}

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column()
  sessionIdentifier: string;

  @ManyToOne(() => User, (user) => user.login, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: User;
}
