import { Injectable } from "@nestjs/common";

import { RedisCacheService } from "../../../common/modules/redis.module";

@Injectable()
export class MatchGameService {
  constructor(private readonly redisService: RedisCacheService) {}
}
