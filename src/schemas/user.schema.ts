import {
  Column,
  DataSource,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { LoginSchema } from "./login.schema";

@Entity()
export class UserSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  email: string;

  @Column()
  name: string;

  @Column()
  nickname: string;

  @Column("int")
  lvl: number;

  @Column("int")
  rating: number;

  @Column()
  @OneToMany(() => LoginSchema, (login) => login.user)
  login: LoginSchema[];
}

export const UserProvider = {
  provide: UserSchema.name,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(UserSchema),
  inject: ["DATA_SOURCE"],
};
