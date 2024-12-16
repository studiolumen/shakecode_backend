import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ErrorMsg } from "../../../common/mapper/error";
import { MapRedisConstant, RedisMapper } from "../../../common/mapper/redis.mapper";
import {
  CompilerType,
  MatchRoomElement,
  TestCodeResult,
  UserJWT,
} from "../../../common/mapper/types";
import { RedisCacheService } from "../../../common/modules/redis.module";
import { Problem, Testcase } from "../../../schemas";
import { ProblemCheckerService } from "../../problem/providers";

@Injectable()
export class MatchGameService {
  constructor(
    private readonly redisService: RedisCacheService,
    private readonly problemCheckerService: ProblemCheckerService,
  ) {}

  async testCode(
    user: UserJWT,
    matchType: RedisMapper,
    problemId: string,
    compiler: CompilerType,
    code: string,
  ): Promise<TestCodeResult> {
    const matchRoomElement: MatchRoomElement = await this.redisService.getJSON<MatchRoomElement>(
      MapRedisConstant(matchType, user.id),
    );

    if (!matchRoomElement) throw new HttpException(ErrorMsg.Match_NotFound, HttpStatus.NOT_FOUND);
    if (matchRoomElement.roomStatus !== "playing")
      throw new HttpException(ErrorMsg.Match_NotFound, HttpStatus.NOT_FOUND);
    if (!matchRoomElement.problems.includes(problemId))
      throw new HttpException(ErrorMsg.Resource_NotFound, HttpStatus.NOT_FOUND);

    return await this.problemCheckerService.testCode(problemId, compiler, code, true);
  }

  async submitCode(
    user: UserJWT,
    matchType: RedisMapper,
    problemId: string,
    compiler: CompilerType,
    code: string,
  ): Promise<boolean> {
    const matchRoomElement: MatchRoomElement = await this.redisService.getJSON<MatchRoomElement>(
      MapRedisConstant(matchType, user.id),
    );

    if (!matchRoomElement) throw new HttpException(ErrorMsg.Match_NotFound, HttpStatus.NOT_FOUND);
    if (matchRoomElement.roomStatus !== "playing")
      throw new HttpException(ErrorMsg.Match_NotFound, HttpStatus.NOT_FOUND);
    if (!matchRoomElement.problems.includes(problemId))
      throw new HttpException(ErrorMsg.Resource_NotFound, HttpStatus.NOT_FOUND);

    return (await this.problemCheckerService.testCode(problemId, compiler, code, false)).passed;
  }
}
