import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { ProblemService } from "../providers";

@ApiTags("Problem")
@Controller("/problem")
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @ApiOperation({
    summary: "get problem",
    description: "get problem and its testcase via problem id",
  })
  @Get("/")
  async getProblem() {
    return this.problemService.getProblemById(0);
  }
}
