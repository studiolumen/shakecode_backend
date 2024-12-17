import { Body, Controller, Delete, Get, HttpStatus, Post, Query, Req } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CustomJwtAuthGuard } from "../../../auth/guards";
import { PermissionGuard } from "../../../auth/guards/permission.guard";
import { UseGuardsWithSwagger } from "../../../auth/guards/useGuards";
import { PermissionEnum } from "../../../common/mapper/permissions";
import { Problem, Testcase } from "../../../schemas";
import {
  CreateProblemDTO,
  GetFullProblemDTO,
  GetProblemListDTO,
  GetTestcasesDTO,
  ProblemIdDTO,
  ProblemSummary,
  TestcaseListResponseDTO,
  UpdateProblemDTO,
  ProblemCheckResult,
  TestcaseIdDTO,
  TestProblemWithoutMatchDTO,
} from "../dto/problem.dto";
import {
  ProblemCheckerService,
  ProblemGetService,
  ProblemManageService,
  ProblemTestCaseService,
} from "../providers";

@ApiTags("Problem")
@Controller("/problem")
export class ProblemController {
  constructor(
    private readonly problemGetService: ProblemGetService,
    private readonly problemPsadderService: ProblemManageService,
    private readonly problemTestcaseService: ProblemTestCaseService,
    private readonly problemCheckerService: ProblemCheckerService,
  ) {}

  @ApiOperation({
    summary: "get problem",
    description: "get single problem via id",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "problem",
    type: ProblemCheckResult,
  })
  @Get("/")
  @UseGuardsWithSwagger(CustomJwtAuthGuard, PermissionGuard([PermissionEnum.GET_PUBLIC_PROBLEM]))
  async getProblem(@Query() data: ProblemIdDTO) {
    return this.problemGetService.getPublicProblemById(data.id);
  }

  @ApiOperation({
    summary: "get problem list",
    description: "list problems",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "problem summary list",
    type: [ProblemSummary],
  })
  @Get("/list")
  @UseGuardsWithSwagger(
    CustomJwtAuthGuard,
    PermissionGuard([PermissionEnum.GET_PUBLIC_PROBLEM, PermissionEnum.GET_PROBLEM], true),
  )
  async getProblemList(@Req() req, @Query() data: GetProblemListDTO) {
    return this.problemGetService.getPublicProblemList(req.user, data.all);
  }

  @ApiOperation({
    summary: "get problem - no filter",
    description: "get user's single public problem with hidden testcases via id",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "problem",
    type: ProblemCheckResult,
  })
  @Get("/full")
  @UseGuardsWithSwagger(
    CustomJwtAuthGuard,
    PermissionGuard([PermissionEnum.GET_PROBLEM, PermissionEnum.GET_PROBLEM_SELF], true),
  )
  async getFullProblem(@Req() req, @Query() data: GetFullProblemDTO) {
    console.log(data);
    return this.problemGetService.getFullProblemById(
      req.user,
      data.id,
      (data.hidden as unknown as string) === "true",
    );
  }

  @ApiOperation({
    summary: "Create problem",
    description: "Create Public problem from given items",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "problem",
    type: Problem,
  })
  @Post("/")
  @UseGuardsWithSwagger(CustomJwtAuthGuard, PermissionGuard([PermissionEnum.CREATE_PROBLEM]))
  async createProblem(@Req() req, @Body() data: CreateProblemDTO) {
    return this.problemPsadderService.createProblem(req.user, data, true);
  }

  @ApiOperation({
    summary: "Update problem",
    description: "Problem from given items via name",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "problem",
    type: Problem,
  })
  @Post("/update")
  @UseGuardsWithSwagger(
    CustomJwtAuthGuard,
    PermissionGuard([PermissionEnum.MODIFY_PROBLEM_SELF, PermissionEnum.MODIFY_PROBLEM], true),
  )
  async updateProblem(@Req() req, @Body() data: UpdateProblemDTO) {
    return this.problemPsadderService.updateProblem(req.user, data);
  }

  @ApiOperation({
    summary: "Delete problem",
    description: "Delete problem via id",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "problem",
    type: Problem,
  })
  @Delete("/")
  @UseGuardsWithSwagger(
    CustomJwtAuthGuard,
    PermissionGuard([PermissionEnum.DELETE_PROBLEM_SELF, PermissionEnum.DELETE_PROBLEM], true),
  )
  async deleteProblem(@Req() req, @Query() data: ProblemIdDTO) {
    return this.problemPsadderService.deleteProblem(req.user, data.id);
  }

  @ApiOperation({
    summary: "get testcases",
    description: "get testcases by problem id",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "problem",
    type: TestcaseListResponseDTO,
  })
  @Get("/testcases")
  @UseGuardsWithSwagger(
    CustomJwtAuthGuard,
    PermissionGuard([PermissionEnum.GET_PROBLEM_SELF, PermissionEnum.GET_PROBLEM], true),
  )
  async getTestcases(@Req() req, @Query() data: GetTestcasesDTO) {
    return this.problemTestcaseService.getTestCases(req.user, data.id, data.from, data.count);
  }

  @ApiOperation({
    summary: "modify testcase",
    description: "modify testcase",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "testcase",
    type: Testcase,
  })
  @Post("/testcases/")
  @UseGuardsWithSwagger(
    CustomJwtAuthGuard,
    PermissionGuard([PermissionEnum.MODIFY_PROBLEM_SELF, PermissionEnum.MODIFY_PROBLEM], true),
  )
  async modifyTestCase(@Req() req, @Body() data: Testcase) {
    return this.problemTestcaseService.modifyTestCase(req.user, data.id, data.input, data.output);
  }

  @ApiOperation({
    summary: "delete testcase",
    description: "delete testcase",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "testcase",
    type: Testcase,
  })
  @Delete("/testcases/")
  @UseGuardsWithSwagger(
    CustomJwtAuthGuard,
    PermissionGuard([PermissionEnum.DELETE_PROBLEM_SELF, PermissionEnum.DELETE_PROBLEM], true),
  )
  async deleteTestCase(@Req() req, @Query() data: TestcaseIdDTO) {
    return this.problemTestcaseService.deleteTestCase(req.user, data.id);
  }

  @ApiOperation({
    summary: "test code",
    description: "test code without match",
  })
  @Post("/checker")
  @UseGuardsWithSwagger(
    CustomJwtAuthGuard,
    PermissionGuard([PermissionEnum.TEST_CODE_WITHOUT_MATCH]),
  )
  async testCodeWithoutMatch(@Body() data: TestProblemWithoutMatchDTO) {
    return this.problemCheckerService.testCode(data.problemId, data.compiler, data.code);
  }
}
