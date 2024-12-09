import {
  Column,
  CreateDateColumn,
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
  @Column()
  websocketInitId: string;

  @Column()
  webSocketId: string;

  @Column()
  rating: number;

  @Column("boolean", { default: false })
  connected: boolean;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.matchQueue, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    eager: true,
  })
  user: User;
}

@Entity()
export class Match {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  start: Date;

  @JoinColumn()
  @ManyToOne(() => MatchInGame, (matchInGame) => matchInGame.match, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    eager: true,
  })
  matchDetails: MatchInGame[];
}

@Entity()
export class MatchInGame {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  submits: number;

  @Column()
  skillPoints: number;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.matchInGame, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    eager: true,
  })
  user: User;

  @JoinColumn()
  @ManyToOne(() => Match, (match) => match.matchDetails, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  match: Match;
}
