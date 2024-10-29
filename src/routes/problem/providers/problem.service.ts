import * as fs from "fs";
import * as child_process from "node:child_process";
import * as path from "path";

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { v4 as uuid } from "uuid";

import { CompilerType } from "../../../common/types";
import { Problem, TestCase } from "../../../schemas";

@Injectable()
export class ProblemService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
    @InjectRepository(TestCase)
    private readonly testCaseRepository: Repository<TestCase>,
  ) {}

  async getProblemById(id: number) {
    const problem = await this.problemRepository.findOne({ where: { id } });
    problem.testCases = problem.testCases.filter(
      (testcase) => testcase.show_user,
    );

    return problem;
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
