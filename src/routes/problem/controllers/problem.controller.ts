import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { CustomJwtAuthGuard } from "../../../auth/guards";
import { PermissionGuard } from "../../../auth/guards/permission.guard";
import { UseGuardsWithSwagger } from "../../../auth/guards/useGuards";
import { PermissionEnum } from "../../../common/types";
import { CreateProblemDTO, GetProblemDTO } from "../dto/problem.dto";
import { ProblemService } from "../providers";

@ApiTags("Problem")
@Controller("/problem")
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @ApiOperation({
    summary: "get problem",
    description: "get single problem via id",
  })
  @Get("/")
  @UseGuardsWithSwagger(
    CustomJwtAuthGuard,
    PermissionGuard(PermissionEnum.GET_PUBLIC_PROBLEM),
  )
  async getProblem(@Body() data: GetProblemDTO) {
    return this.problemService.getPublicProblemById(data.id, true);
  }

  @ApiOperation({
    summary: "get problem list",
    description: "list problems",
  })
  @Get("/list")
  @UseGuardsWithSwagger(
    CustomJwtAuthGuard,
    PermissionGuard(PermissionEnum.GET_PUBLIC_PROBLEM),
  )
  async getProblems() {
    return this.problemService.getPublicProblems();
  }

  @ApiOperation({
    summary: "Create problem",
    description: "Create Public problem from given items",
  })
  @Post("/")
  @UseGuardsWithSwagger(
    CustomJwtAuthGuard,
    PermissionGuard(PermissionEnum.CREATE_PROBLEM),
  )
  async createProblem(@Req() req, @Body() data: CreateProblemDTO) {
    return this.problemService.createProblem(req.user, data, true);
  }
}
