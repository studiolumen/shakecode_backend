import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ClassProblem, Problem, User } from "../../../schemas";
import { CreateClassProblemDTO } from "../../problem/dto/problem.dto";
import { ProblemGetService } from "../../problem/providers";

@Injectable()
export class ClassProblemService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
    @InjectRepository(ClassProblem)
    private readonly classProblemRepository: Repository<ClassProblem>,

    private readonly problemService: ProblemGetService,
  ) {}

  async createClassProblem(user: User, data: CreateClassProblemDTO) {
    // const class =
    // const problem = await this.problemService.createProblem(user, data);
    // const classProblem = new ClassProblem();
    // classProblem.problem = problem;
    // classProblem.
  }
}
