import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./user.schema";

@Entity()
export class MatchQueue {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Generated("uuid")
  webSocketId: string;

  @Column()
  rating: number;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.matchQueue, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    eager: true,
  })
  user: User;
}
