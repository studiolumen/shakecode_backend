import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { CommonUserPermission } from "../common/types";
import { numberPermission } from "../common/utils/permission.util";

import { Login } from "./auth.schema";
import { ClassUser } from "./group.schema";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  email: string = null;

  @Column()
  name: string = null;

  @Column()
  nickname: string = null;

  @Column("int", { default: 0 })
  lvl: number = 0;

  @Column("int", { default: 7500 })
  rating: number = 7500;

  @Column("int", { default: numberPermission(...CommonUserPermission) })
  permission: number;

  @OneToMany(() => Login, (login) => login.user)
  login: Login[];

  @OneToMany(() => ClassUser, (classUser) => classUser.user)
  classUser: ClassUser[];
}
