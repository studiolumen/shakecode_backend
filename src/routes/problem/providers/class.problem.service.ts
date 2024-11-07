import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Problem, User } from "../../../schemas";
import { CreateProblemDTO } from "../dto/problem.manage.dto";

import { ProblemService } from "./problem.service";

@Injectable()
export class ClassProblemService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,

    private readonly problemService: ProblemService,
  ) {}

  async createClassProblem(user: User, data: CreateProblemDTO) {
    await this.problemService.createProblem(user, data);
  }
}
