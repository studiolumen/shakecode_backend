import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { v4 as uuid } from "uuid";

import { RedisMapper } from "../../../common/mapper/redis.mapper";
import { MatchQueueElement, MatchRoomElement, UserJWT } from "../../../common/mapper/types";
import { RedisCacheService } from "../../../common/modules/redis.module";
import { User } from "../../../schemas";

@Injectable()
export class MatchQueueService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly redisService: RedisCacheService,
  ) {}

  async registerMatchQueue(user: UserJWT): Promise<string> {
    const redisKey = `${RedisMapper.MQ_PRIVATE}_${user.id}`;

    const existingMatchQueue = await this.redisService.get(redisKey);
    if (existingMatchQueue) {
      const parsed = JSON.parse(existingMatchQueue);
      if (parsed.connected) await this.redisService.del(redisKey);
      else return parsed.websocketInitId;
    }

    const dbUser = await this.userRepository.findOne({ where: { id: user.id } });

    const matchQueueElement: MatchQueueElement = {
      connected: false,
      websocketInitId: uuid().replaceAll("-", ""),
      user: dbUser.id,
      rating: dbUser.rating,
    };
    await this.redisService.set(redisKey, JSON.stringify(matchQueueElement));
    return matchQueueElement.websocketInitId;
  }

  async createPrivateRoom(user: UserJWT): Promise<string> {
    const redisKey = `${RedisMapper.MR_PRIVATE}_${user.id}`;
    await this.redisService.del(redisKey);

    const matchRoomElement: MatchRoomElement = {
      websocketInitId: uuid().replaceAll("-", ""),
      roomId: uuid().substring(0, 4),
      gameMode: "1VS1",
      players: [],
      maxPlayer: 2,
      roomOwner: { userId: user.id, socketId: null },
      roomStatus: "waiting_owner",
      issued: Date.now(),
    };

    await this.redisService.set(redisKey, JSON.stringify(matchRoomElement));

    return matchRoomElement.websocketInitId;
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async queueScan() {}
}
