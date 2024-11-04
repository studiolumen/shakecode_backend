import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

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
  async createProblem(@Req() req, @Body() data: CreateProblemDTO) {
    return this.problemManageService.createProblem(req.user, data);
  }
}
