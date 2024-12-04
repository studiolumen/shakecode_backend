import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { PermissionValidationType } from "../common/types";

@Entity()
export class PermissionValidator {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  type: PermissionValidationType;

  @Column()
  key: string;

  @Column()
  value: number;
}
