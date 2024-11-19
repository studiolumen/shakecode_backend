import * as fs from "fs";
import * as child_process from "node:child_process";
import * as path from "path";

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import merge from "merge-js-class";
import { Repository } from "typeorm";
import { v4 as uuid } from "uuid";

import { ErrorMsg } from "../../../common/error";
import {
  CompilerType,
  PermissionEnum,
  ProblemCheckResult,
} from "../../../common/types";
import { hasPermission } from "../../../common/utils/permission.util";
import { Problem, PublicProblem, TestCase, User } from "../../../schemas";
import {
  CreateProblemDTO,
  ProblemSummary,
  UpdateProblemDTO,
} from "../dto/problem.dto";

@Injectable()
export class ProblemService {
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

  async getPublicProblemById(
    id: number,
    forUser?: boolean,
  ): Promise<ProblemCheckResult> {
    const publicProblem = await this.publicProblemRepository.findOne({
      where: { id: id || 0 },
    });

    if (forUser)
      publicProblem.problem.testCases = publicProblem.problem.testCases.filter(
        (tc) => tc.show_user,
      );

    return { pid: publicProblem.pid, ...publicProblem.problem };
  }

  async getSelfProblemById(
    user: any,
    id: number,
  ): Promise<Problem | ProblemCheckResult> {
    const problem = await this.problemRepository.findOne({
      where: { id: id || 0 },
    });
    if (
      problem.user.id !== user.id &&
      !hasPermission(user.permission, [PermissionEnum.MANAGE_PERMISSION])
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

  async getPublicProblems(): Promise<ProblemSummary[]> {
    return (await this.publicProblemRepository.find())
      .filter((p) => p.problem.restricted === 0)
      .map((p) => ({
        id: p.problem.id,
        pid: p.pid,
        title: p.problem.name,
        description: p.problem.description,
        category: p.problem.category,
      }))
      .sort((a, b) => a.id - b.id);
  }

  async createProblem(
    user: User,
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
    user: User,
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

  async deleteProblem(id: number) {
    return await this.problemRepository.remove(
      await this.problemRepository.findOne({ where: { id: id } }),
    );
  }

  async runCode(
    type: CompilerType,
    code: string,
    inputs: string[],
  ): Promise<string> {
    const id = uuid();
    const basePath = path.join(__dirname, "../docker");
    fs.mkdirSync(path.join(basePath, id));
    switch (type) {
      case "gcc":
        fs.copyFileSync(
          path.join(basePath, "Dockerfile_gcc"),
          path.join(basePath, id, "Dockerfile"),
        );
        fs.writeFileSync(path.join(basePath, id, "code.c"), code, {
          flag: "w",
        });
        break;
      case "node":
        fs.copyFileSync(
          path.join(basePath, "Dockerfile_node"),
          path.join(basePath, id, "Dockerfile"),
        );
        fs.writeFileSync(path.join(basePath, id, "code.js"), code, {
          flag: "w",
        });
        break;
      case "python":
        fs.copyFileSync(
          path.join(basePath, "Dockerfile_python"),
          path.join(basePath, id, "Dockerfile"),
        );
        fs.writeFileSync(path.join(basePath, id, "code.py"), code, {
          flag: "w",
        });
        break;
      default:
        throw new HttpException("Cannot find compiler", HttpStatus.BAD_REQUEST);
    }

    const workDir = { cwd: path.join(basePath, id) };
    fs.writeFileSync(path.join(basePath, id, "input.txt"), inputs.join("\n"));
    await new Promise((accept) => {
      child_process.exec(`docker build . -t ${id}`, workDir, accept);
    });
    await new Promise((accept) => {
      child_process.exec(`docker run  --name ${id} ${id}`, workDir, accept);
    });
    const result: string = await new Promise((accept) => {
      child_process.exec(
        `docker logs ${id}`,
        workDir,
        (error, stdout, stderror) => {
          accept(stdout + "\n" + stderror);
        },
      );
    });

    await new Promise((accept) => {
      child_process.exec(`docker rm ${id} -f`, workDir, accept);
    });
    await new Promise((accept) => {
      child_process.exec(`docker image rm ${id} -f`, workDir, accept);
    });
    fs.rmSync(path.join(basePath, id), { recursive: true, force: true });
    return result;
  }
}
