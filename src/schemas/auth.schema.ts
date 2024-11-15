import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { LoginType, LoginTypeValues } from "../common/types";

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

  @Column({ enum: LoginTypeValues })
  type: LoginType = null;

  @Column("text")
  identifier1: string = null;

  @Column("text")
  identifier2: string = null;
}

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accessToken: string = null;

  @Column()
  refreshToken: string = null;

  @Column()
  sessionIdentifier: string = null;

  @ManyToOne(() => User, (user) => user.session, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: User;
}
