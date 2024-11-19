import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";

import { CustomJwtAuthGuard } from "../../../auth/guards";
import { PermissionGuard } from "../../../auth/guards/permission.guard";
import { UseGuardsWithSwagger } from "../../../auth/guards/useGuards";
import { PermissionEnum } from "../../../common/types";
import { CreateProblemDTO } from "../dto/problem.dto";
import { ProblemService } from "../providers";

@ApiTags("Problem")
@Controller("/problem")
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @ApiOperation({
    summary: "get problem",
    description: "get single problem via id",
  })
  @ApiQuery({
    required: true,
    name: "id",
    description: "problem id",
    type: Number,
  })
  @Get("/")
  @UseGuardsWithSwagger(
    CustomJwtAuthGuard,
    PermissionGuard([PermissionEnum.GET_PUBLIC_PROBLEM]),
  )
  async getProblem(@Query("id") id: number) {
    return this.problemService.getPublicProblemById(id, true);
  }

  @ApiOperation({
    summary: "get problem - no filter",
    description:
      "get user's single public problem with hidden testcases via id",
  })
  @ApiQuery({
    required: true,
    name: "id",
    description: "problem id",
    type: Number,
  })
  @Get("/full")
  @UseGuardsWithSwagger(
    CustomJwtAuthGuard,
    PermissionGuard([
      PermissionEnum.GET_PUBLIC_PROBLEM,
      PermissionEnum.GET_PROBLEM_SELF,
    ]),
  )
  async getFullProblem(@Req() req, @Query("id") id: number) {
    return this.problemService.getSelfPublicProblemById(req.user, id);
  }

  @ApiOperation({
    summary: "get problem list",
    description: "list problems",
  })
  @Get("/list")
  @UseGuardsWithSwagger(
    CustomJwtAuthGuard,
    PermissionGuard([PermissionEnum.GET_PUBLIC_PROBLEM]),
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
    PermissionGuard([PermissionEnum.CREATE_PROBLEM]),
  )
  async createProblem(@Req() req, @Body() data: CreateProblemDTO) {
    return this.problemService.createProblem(req.user, data, true);
  }

  @ApiOperation({
    summary: "Update problem",
    description: "Problem from given items via name",
  })
  @Post("/update")
  @UseGuardsWithSwagger(
    CustomJwtAuthGuard,
    PermissionGuard(
      [PermissionEnum.MODIFY_PROBLEM_SELF, PermissionEnum.MODIFY_PROBLEM],
      true,
    ),
  )
  async updateProblem(@Req() req, @Body() data: CreateProblemDTO) {
    return this.problemService.updateProblem(req.user, data);
  }
}
