import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import merge from "merge-js-class";
import { Repository } from "typeorm";

import { Problem, TestCase, User } from "../../../schemas";
import { CreateProblemDTO } from "../dto/problem.manage.dto";

@Injectable()
export class ProblemManageService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
    @InjectRepository(TestCase)
    private readonly testCaseRepository: Repository<TestCase>,
  ) {}

  async getProblemById(id: number) {
    return await this.problemRepository.findOne({ where: { id } });
  }

  async createProblem(user: User, data: CreateProblemDTO) {
    const dbUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    const problem = await merge(new Problem(), data);
    problem.user = dbUser;

    const testcases = [];
    for (const t of data.testCases) {
      const tc = await merge(new TestCase(), t);
      tc.problem = problem;
      tc.show_user = t.show_user;
      testcases.push(tc);
    }

    await this.problemRepository.save(problem);
    await this.testCaseRepository.save(testcases);

    return problem;
  }

  async deleteProblem(id: number) {
    return await this.problemRepository.remove(await this.getProblemById(id));
  }
}
