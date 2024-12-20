import { Body, Controller, Post, Req } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { CustomJwtAuthGuard } from "../../../auth/guards";
import { PermissionGuard } from "../../../auth/guards/permission.guard";
import { UseGuardsWithSwagger } from "../../../auth/guards/useGuards";
import { PermissionEnum } from "../../../common/mapper/permissions";
import { RunCodeDTO } from "../dto/match.game.dto";
import { MatchGameService } from "../providers";

@ApiTags("Match Game")
@Controller("/match/game")
export class MatchGameController {
  constructor(private readonly matchGameService: MatchGameService) {}

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
    return this.matchGameService.testCode(
      req.user,
      data.matchType,
      data.problemId,
      data.compiler,
      data.code,
    );
  }
}
