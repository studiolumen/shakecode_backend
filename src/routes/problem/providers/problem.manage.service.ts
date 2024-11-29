import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import merge from "merge-js-class";
import { Repository } from "typeorm";

import { ErrorMsg } from "../../../common/error";
import { PermissionEnum, UserJWT } from "../../../common/types";
import { hasPermission } from "../../../common/utils/permission.util";
import { Problem, PublicProblem, TestCase, User } from "../../../schemas";
import { CreateProblemDTO, UpdateProblemDTO } from "../dto/problem.dto";

@Injectable()
export class ProblemManageService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
    @InjectRepository(PublicProblem)
    private readonly publicProblemRepository: Repository<PublicProblem>,
    @InjectRepository(TestCase)
    private readonly testCaseRepository: Repository<TestCase>,
  ) {}

  async createProblem(
    user: UserJWT,
    data: CreateProblemDTO,
    linkPublic: boolean = false,
  ): Promise<Problem | PublicProblem> {
    const dbUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    const problem = merge(new Problem(), data);
    problem.user = dbUser;

    const testcases = [];
    for (const t of data.testcases) {
      const tc = merge(new TestCase(), t);
      tc.problem = problem;
      testcases.push(tc);
    }

    const result = await this.problemRepository.save(problem);
    await this.testCaseRepository.save(testcases);

    if (linkPublic) {
      const publicProblem = new PublicProblem();
      publicProblem.problem = result;

      return await this.publicProblemRepository.save(publicProblem);
    }

    return problem;
  }

  async updateProblem(
    user: UserJWT,
    data: UpdateProblemDTO,
  ): Promise<Problem | PublicProblem> {
    const dbUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    const existingProblem = await this.problemRepository.findOne({
      where: { id: data.id },
    });

    if (!existingProblem)
      throw new HttpException(ErrorMsg.Resource_NotFound, HttpStatus.NOT_FOUND);

    if (
      existingProblem.user.id !== dbUser.id &&
      !hasPermission(dbUser.permission, [PermissionEnum.MODIFY_PROBLEM])
    )
      throw new HttpException(
        ErrorMsg.PermissionDenied_Action,
        HttpStatus.FORBIDDEN,
      );

    const problem = merge(existingProblem, data);
    delete problem.pid;
    delete problem.testcases;

    const testcases = [];
    for (const t of data.testcases) {
      const tc = merge(new TestCase(), t);
      tc.problem = problem;
      testcases.push(tc);
    }

    const result = await this.problemRepository.save(problem);
    await this.testCaseRepository.delete({ problem: problem });
    await this.testCaseRepository.save(testcases);

    const publicProblem = await this.publicProblemRepository.findOne({
      where: { problem: problem },
    });

    if (publicProblem && publicProblem.pid !== data.pid) {
      publicProblem.pid = data.pid;
      await this.publicProblemRepository.save(publicProblem);
    }

    return result;
  }

  async deleteProblem(user: UserJWT, id: number) {
    if (isNaN(id))
      throw new HttpException(
        ErrorMsg.InvalidParameter,
        HttpStatus.BAD_REQUEST,
      );

    const existingProblem = await this.problemRepository.findOne({
      where: { id: id },
    });
    if (!existingProblem)
      throw new HttpException(ErrorMsg.Resource_NotFound, HttpStatus.NOT_FOUND);

    if (
      existingProblem.user.id !== user.id &&
      !hasPermission(user.permission, [PermissionEnum.DELETE_PROBLEM])
    )
      throw new HttpException(
        ErrorMsg.PermissionDenied_Action,
        HttpStatus.FORBIDDEN,
      );
    return await this.problemRepository.remove(existingProblem);
  }
}
