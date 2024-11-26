import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ErrorMsg } from "../../../common/error";
import {
  PermissionEnum,
  ProblemCheckResult,
  UserJWT,
} from "../../../common/types";
import { hasPermission } from "../../../common/utils/permission.util";
import { Problem, PublicProblem, TestCase, User } from "../../../schemas";
import { ProblemSummary } from "../dto/problem.dto";

@Injectable()
export class ProblemGetService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
    @InjectRepository(TestCase)
    private readonly testCaseRepository: Repository<TestCase>,

    @InjectRepository(PublicProblem)
    private readonly publicProblemRepository: Repository<PublicProblem>,
  ) {}

  async getPublicProblemList(
    user: UserJWT,
    all: boolean,
  ): Promise<ProblemSummary[]> {
    return (await this.publicProblemRepository.find())
      .filter(
        (p) =>
          p.problem.restricted === 0 || (user.id === p.problem.user.id && all),
      )
      .map((p) => ({
        id: p.problem.id,
        pid: p.pid,
        title: p.problem.name,
        description: p.problem.description,
        category: p.problem.category,
      }))
      .sort((a, b) => a.id - b.id);
  }

  async getPublicProblemById(id: number): Promise<ProblemCheckResult> {
    const publicProblem = await this.publicProblemRepository.findOne({
      where: { id: id },
    });

    if (!publicProblem)
      throw new HttpException(ErrorMsg.Resource_NotFound, HttpStatus.NOT_FOUND);

    if (publicProblem.problem.restricted !== 0)
      throw new HttpException(
        ErrorMsg.PermissionDenied_Resource,
        HttpStatus.FORBIDDEN,
      );

    publicProblem.problem.testCases = publicProblem.problem.testCases.filter(
      (tc) => tc.show_user,
    );

    return { pid: publicProblem.pid, ...publicProblem.problem };
  }

  async getSelfProblemById(
    user: UserJWT,
    id: number,
  ): Promise<Problem | ProblemCheckResult> {
    const problem = await this.problemRepository.findOne({
      where: { id: id || 0 },
    });

    if (
      problem.user.id !== user.id &&
      !hasPermission(user.permission, [PermissionEnum.GET_PROBLEM])
    )
      throw new HttpException(
        ErrorMsg.PermissionDenied_Resource,
        HttpStatus.FORBIDDEN,
      );

    const publicProblem = await this.publicProblemRepository.findOne({
      where: { problem: problem },
    });
    if (publicProblem) return { pid: publicProblem.pid, ...problem };
    else return problem;
  }
}
