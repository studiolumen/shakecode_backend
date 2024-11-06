import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { CustomJwtAuthGuard } from "../../../auth/guards";
import { PermissionGuard } from "../../../auth/guards/permission.guard";
import { UseGuardsWithSwagger } from "../../../auth/guards/useGuards";
import { PermissionEnum } from "../../../common/types";
import { CreateProblemDTO } from "../dto/problem.manage.dto";
import { ProblemManageService, ProblemService } from "../providers";

@ApiTags("Problem")
@Controller("/problem")
export class ProblemController {
  constructor(
    private readonly problemService: ProblemService,
    private readonly problemManageService: ProblemManageService,
  ) {}

  @ApiOperation({
    summary: "get problem",
    description: "get problem and its testcase via problem id",
  })
  @Get("/")
  async getProblem() {
    return this.problemService.getProblemById(0);
  }

  @ApiOperation({
    summary: "Create problem",
    description: "Create problem from given items",
  })
  @Post("/")
  @UseGuardsWithSwagger(
    CustomJwtAuthGuard,
    PermissionGuard(PermissionEnum.CREATE_PROBLEM),
  )
  async createProblem(@Req() req, @Body() data: CreateProblemDTO) {
    return this.problemManageService.createProblem(req.user, data);
  }
}
