import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserJWT } from "../../../common/types";
import { MatchQueue, User } from "../../../schemas";

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(MatchQueue)
    private readonly matchQueueRepository: Repository<MatchQueue>,
  ) {}

  async registerMatchQueue(user: UserJWT): Promise<string> {
    const dbUser = await this.userRepository.findOneBy({ id: user.id });
    const existingMatchQueue = await this.matchQueueRepository.findOneBy({
      user: dbUser,
    });

    if (existingMatchQueue && !existingMatchQueue.connected)
      return existingMatchQueue.websocketInitId;

    if (existingMatchQueue && existingMatchQueue.connected)
      await this.matchQueueRepository.remove(existingMatchQueue);

    const matchQueue = new MatchQueue();
    matchQueue.user = dbUser;
    matchQueue.rating = dbUser.rating;

    return (await this.matchQueueRepository.save(matchQueue)).websocketInitId;
  }
}
