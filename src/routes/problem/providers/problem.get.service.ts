import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ErrorMsg } from "../../../common/mapper/error";
import { PermissionEnum } from "../../../common/mapper/permissions";
import { UserJWT } from "../../../common/mapper/types";
import { hasPermission } from "../../../common/utils/permission.util";
import { Problem, PublicProblem, Testcase, User } from "../../../schemas";
import { ProblemSummary, ProblemCheckResult } from "../dto/problem.dto";

@Injectable()
export class ProblemGetService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
    @InjectRepository(Testcase)
    private readonly testCaseRepository: Repository<Testcase>,

    @InjectRepository(PublicProblem)
    private readonly publicProblemRepository: Repository<PublicProblem>,
  ) {}

  async getPublicProblemList(user: UserJWT, all: boolean): Promise<ProblemSummary[]> {
    return (await this.publicProblemRepository.find())
      .filter((p) => p.problem.restricted === 0 || (user.id === p.problem.user.id && all))
      .map((p) => ({
        id: p.problem.id,
        pid: p.pid,
        title: p.problem.name,
        description: p.problem.description,
        category: p.problem.category,
        difficulty: p.problem.difficulty,
      }))
      .sort((a, b) => a.pid - b.pid);
  }

  async getPublicProblemById(id: string): Promise<ProblemCheckResult> {
    const problem = await this.problemRepository
      .createQueryBuilder("problem")
      .leftJoinAndSelect("problem.testCases", "testcase", "testcase.show_user = :showUser", {
        showUser: true,
      })
      .where("problem.id = :id", { id })
      .getOne();
    const publicProblem = await this.publicProblemRepository.findOne({ where: { problem } });
    const testcasesCount = await this.testCaseRepository.count({
      where: { problem },
    });

    console.log(problem);

    if (!problem) throw new HttpException(ErrorMsg.Resource_NotFound, HttpStatus.NOT_FOUND);

    if (problem.restricted !== 0)
      throw new HttpException(ErrorMsg.PermissionDenied_Resource, HttpStatus.FORBIDDEN);

    return { pid: publicProblem.pid, ...problem, testcasesCount };
  }

  async getFullProblemById(
    user: UserJWT,
    id: string,
    hidden: boolean,
  ): Promise<ProblemCheckResult> {
    const problem = await this.problemRepository.findOne({
      where: { id: id },
    });
    const testcases = await this.testCaseRepository.find({
      where: hidden ? { problem: problem } : { problem: problem, show_user: true },
    });
    const testcasesCount = await this.testCaseRepository.count({
      where: { problem: problem },
    });

    if (
      problem.user.id !== user.id &&
      !hasPermission(user.permission, [PermissionEnum.GET_PROBLEM])
    )
      throw new HttpException(ErrorMsg.PermissionDenied_Resource, HttpStatus.FORBIDDEN);

    const publicProblem = await this.publicProblemRepository.findOne({
      where: { problem: problem },
    });

    if (publicProblem)
      return {
        pid: publicProblem.pid,
        ...problem,
        testCases: testcases,
        testcasesCount,
      };
    else
      return {
        ...problem,
        testCases: testcases,
        testcasesCount,
      };
  }
}
