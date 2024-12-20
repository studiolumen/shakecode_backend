import { Body, Controller, Post, Req } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { CustomJwtAuthGuard } from "../../../auth/guards";
import { PermissionGuard } from "../../../auth/guards/permission.guard";
import { UseGuardsWithSwagger } from "../../../auth/guards/useGuards";
import { PermissionEnum } from "../../../common/mapper/permissions";
import { ProblemIdDTO } from "../../problem/dto/problem.dto";
import { RunCodeDTO } from "../dto/match.game.dto";
import { MatchGameGateway } from "../gateways";
import { MatchGameService } from "../providers";

@ApiTags("Match Game")
@Controller("/match/game")
export class MatchGameController {
  constructor(
    private readonly matchGameGateway: MatchGameGateway,
    private readonly matchGameService: MatchGameService,
  ) {}

  @ApiOperation({
    summary: "test code",
    description: "test code with shown testcases",
  })
  @Post("/test")
  @UseGuardsWithSwagger(CustomJwtAuthGuard, PermissionGuard([PermissionEnum.TEST_CODE]))
  async testCode(@Req() req, @Body() data: RunCodeDTO) {
    return this.matchGameService.testCode(
      req.user,
      data.matchType,
      data.problemId,
      data.compiler,
      data.code,
    );
  }

  @ApiOperation({
    summary: "submit code",
    description: "submit answer code",
  })
  @Post("/submit")
  @UseGuardsWithSwagger(CustomJwtAuthGuard, PermissionGuard([PermissionEnum.SUBMIT_CODE]))
  async submitCode(@Req() req, @Body() data: RunCodeDTO) {
    return this.matchGameService.submitCode(
      req.user,
      data.matchType,
      data.problemId,
      data.compiler,
      data.code,
    );
  }

  @Post("/notice_submission")
  async noticeSubmission() {
    this.matchGameGateway.getSubmission(null, null);
  }

  @Post("/drawRound")
  async drawRound() {
    this.matchGameGateway.server.emit("round:draw");
  }

  @Post("/drawMatch")
  async drawMatch() {
    this.matchGameGateway.server.emit("match:draw");
  }

  @Post("/setProblem")
  async setProblem(@Body() data: ProblemIdDTO) {
    this.matchGameGateway.currentProblem = data.id;
  }
}
