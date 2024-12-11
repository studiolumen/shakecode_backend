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
