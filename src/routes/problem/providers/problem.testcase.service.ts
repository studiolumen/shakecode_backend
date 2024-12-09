import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ErrorMsg } from "../../../common/error";
import { PermissionEnum, UserJWT } from "../../../common/types";
import { hasPermission } from "../../../common/utils/permission.util";
import { Problem, TestCase } from "../../../schemas";
import { TestcaseListResponseDTO } from "../dto/problem.dto";

@Injectable()
export class ProblemTestCaseService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
    @InjectRepository(TestCase)
    private readonly testCaseRepository: Repository<TestCase>,
  ) {}

  async generateTestCase() {}

  async getTestCases(user: UserJWT, problemId: string, from: number, count: number): Promise<TestcaseListResponseDTO> {
    const problem = await this.problemRepository.findOne({
      where: { id: problemId },
    });
    if (!problem) throw new HttpException(ErrorMsg.Resource_NotFound, HttpStatus.NOT_FOUND);

    if (problem.user.id !== user.id && !hasPermission(user.permission, []))
      throw new HttpException(ErrorMsg.PermissionDenied_Resource, HttpStatus.FORBIDDEN);

    return {
      testcases: await this.testCaseRepository.find({
        where: { problem: problem },
        skip: from,
        take: count,
      }),
      count: await this.testCaseRepository.count({
        where: { problem: problem },
      }),
    };
  }

  async modifyTestCase(user: UserJWT, id: string, input: string, output: string): Promise<TestCase> {
    const testcase = await this.testCaseRepository.findOne({
      where: { id: id },
      relations: ["problem"],
    });
    if (!testcase) throw new HttpException(ErrorMsg.Resource_NotFound, HttpStatus.NOT_FOUND);

    if (testcase.problem.user.id !== user.id && !hasPermission(user.permission, [PermissionEnum.MODIFY_PROBLEM]))
      throw new HttpException(ErrorMsg.PermissionDenied_Resource, HttpStatus.FORBIDDEN);

    testcase.input = input;
    testcase.output = output;

    return await this.testCaseRepository.save(testcase);
  }

  async deleteTestCase(user: UserJWT, id: string): Promise<TestCase> {
    const testcase = await this.testCaseRepository.findOne({
      where: { id: id },
      relations: ["problem"],
    });
    if (!testcase) throw new HttpException(ErrorMsg.Resource_NotFound, HttpStatus.NOT_FOUND);

    if (testcase.problem.user.id !== user.id && !hasPermission(user.permission, [PermissionEnum.MODIFY_PROBLEM]))
      throw new HttpException(ErrorMsg.PermissionDenied_Resource, HttpStatus.FORBIDDEN);

    return await this.testCaseRepository.remove(testcase);
  }
}
