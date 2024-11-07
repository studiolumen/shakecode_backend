import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { PermissionValidationType } from "../common/types";

@Entity()
export class PermissionValidator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: PermissionValidationType;

  @Column()
  key: string;

  @Column()
  value: number;
}
