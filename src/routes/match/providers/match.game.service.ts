import { Injectable } from "@nestjs/common";

import { RedisMapper } from "../../../common/mapper/redis.mapper";
import { CompilerType, SubmitResult, TestCodeResult, UserJWT } from "../../../common/mapper/types";
import { RedisCacheService } from "../../../common/modules/redis.module";
import { ProblemCheckerService } from "../../problem/providers";
import { MatchGameGateway } from "../gateways";

@Injectable()
export class MatchGameService {
  constructor(
    private readonly matchGameGateway: MatchGameGateway,

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
    // const matchRoomElement: MatchRoomElement = await this.redisService.getJSON<MatchRoomElement>(
    //   MapRedisConstant(matchType, user.id),
    // );

    // if (!matchRoomElement) throw new HttpException(ErrorMsg.Match_NotFound, HttpStatus.NOT_FOUND);
    // if (matchRoomElement.roomStatus !== "playing")
    //   throw new HttpException(ErrorMsg.Match_NotFound, HttpStatus.NOT_FOUND);
    // if (!matchRoomElement.problems.includes(problemId))
    //   throw new HttpException(ErrorMsg.Resource_NotFound, HttpStatus.NOT_FOUND);

    return await this.problemCheckerService.testCode(problemId, compiler, code, true);
  }

  async submitCode(
    user: UserJWT,
    matchType: RedisMapper,
    problemId: string,
    compiler: CompilerType,
    code: string,
  ): Promise<SubmitResult> {
    // const matchRoomElement: MatchRoomElement = await this.redisService.getJSON<MatchRoomElement>(
    //   MapRedisConstant(matchType, user.id),
    // );

    // if (!matchRoomElement) throw new HttpException(ErrorMsg.Match_NotFound, HttpStatus.NOT_FOUND);
    // if (matchRoomElement.roomStatus !== "playing")
    //   throw new HttpException(ErrorMsg.Match_NotFound, HttpStatus.NOT_FOUND);
    // if (!matchRoomElement.problems.includes(problemId))
    //   throw new HttpException(ErrorMsg.Resource_NotFound, HttpStatus.NOT_FOUND);
    if (problemId !== this.matchGameGateway.problemList[this.matchGameGateway.round]) {
      return { passed: false, error: "problem" };
    }

    const rediskey = "submition";
    const timestamp = Date.now();

    const result = await this.problemCheckerService.testCode(problemId, compiler, code, false);
    const submits = await this.redisService.get(rediskey);
    if (submits) {
      const data = (await this.redisService.getJSON(rediskey)) as (TestCodeResult & {
        user: string;
        timestamp: number;
        problemId: string;
      })[];
      data.push({ user: user.name, problemId, timestamp, ...result });
      await this.redisService.setJSON(rediskey, data);
    } else {
      await this.redisService.setJSON(rediskey, [
        { user: user.name, problemId, timestamp, ...result },
      ]);
    }
    this.matchGameGateway.server.emit("data_submissions", {
      body: await this.redisService.getJSON("submition"),
    });
    const passed = result.passed;
    if (passed) {
      this.matchGameGateway.roundEnd(user.name);
    }
    console.log(`Submit approved! ${passed}`);
    return { passed, error: result.error };
  }
}
