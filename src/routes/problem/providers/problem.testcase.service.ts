import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ErrorMsg } from "../../../common/error";
import { UserJWT } from "../../../common/types";
import { hasPermission } from "../../../common/utils/permission.util";
import { Problem, TestCase } from "../../../schemas";

@Injectable()
export class ProblemTestCaseService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
    @InjectRepository(TestCase)
    private readonly testCaseRepository: Repository<TestCase>,
  ) {}

  async generateTestCase() {}

  async getTestCases(
    user: UserJWT,
    problemId: string,
    from: number,
    count: number,
  ) {
    const problem = await this.problemRepository.findOne({
      where: { id: problemId },
    });
    if (!problem)
      return new HttpException(
        ErrorMsg.Resource_NotFound,
        HttpStatus.NOT_FOUND,
      );

    if (problem.user.id !== user.id && !hasPermission(user.permission, []))
      return new HttpException(
        ErrorMsg.PermissionDenied_Resource,
        HttpStatus.FORBIDDEN,
      );

    return await this.testCaseRepository.find({
      where: { problem: problem },
      skip: from,
      take: count,
    });
  }
}
