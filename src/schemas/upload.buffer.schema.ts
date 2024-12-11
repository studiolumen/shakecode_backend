import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { UploadBufferIdentifier } from "../common/mapper/types";

import { User } from "./user.schema";

@Entity()
export class UploadBuffer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar")
  identifier: UploadBufferIdentifier;

  @Column("text")
  data: string;

  @ManyToOne(() => User, (user) => user.uploadBuffer, { eager: true })
  user: User;
}
