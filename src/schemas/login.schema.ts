import {
  Column,
  DataSource,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { LoginTypesValues } from "../common/types";

import { UserSchema } from "./user.schema";

@Entity()
export class LoginSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => UserSchema, (user) => user.login, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: UserSchema;

  @Column({ enum: LoginTypesValues })
  type: string;
}

export const LoginProvider = {
  provide: UserSchema.name,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(UserSchema),
  inject: ["DATA_SOURCE"],
};
