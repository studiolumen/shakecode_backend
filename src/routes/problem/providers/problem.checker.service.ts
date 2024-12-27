import * as child_process from "child_process";
import * as fs from "fs";
import * as path from "path";

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { v4 as uuid } from "uuid";

import { CompilerType, TestCodeResult } from "../../../common/mapper/types";
import { Problem, Testcase } from "../../../schemas";

@Injectable()
export class ProblemCheckerService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
    @InjectRepository(Testcase)
    private readonly testcaseRepository: Repository<Testcase>,
  ) {}

  async runCode(
    type: CompilerType,
    code: string,
    inputs: string[],
    m_limit: number = 256,
  ): Promise<string[]> {
    const id = uuid();
    const basePath = path.join(__dirname, "../../../common/docker");
    const workDir = { cwd: path.join(basePath, id) };

    let output: string;
    try {
      fs.mkdirSync(path.join(basePath, id));
      fs.copyFileSync(
        path.join(basePath, `Dockerfile_${type}`),
        path.join(basePath, id, "Dockerfile"),
      );
      fs.writeFileSync(path.join(basePath, id, "mem.txt"), (m_limit * 1024 * 1024).toString(), {
        flag: "w",
      });
      fs.writeFileSync(path.join(basePath, id, "code"), code, { flag: "w" });
      for (let i = 0; i < inputs.length; i++) {
        fs.writeFileSync(path.join(basePath, id, `input_${i}.txt`), inputs[i]);
      }
      await new Promise((accept) => {
        child_process.exec(`docker build . -t ${id}`, workDir, accept);
      });
      await new Promise((accept) => {
        child_process.exec(`docker run --name ${id} ${id}`, workDir, accept);
      });
      output = await new Promise((accept) => {
        child_process.exec(`docker logs ${id}`, workDir, (error, stdout, stderror) => {
          accept(stdout + "\n" + stderror);
        });
      });
    } finally {
      await new Promise((accept) => {
        child_process.exec(`docker rm ${id} -f`, workDir, accept);
      });
      await new Promise((accept) => {
        child_process.exec(`docker image rm ${id} -f`, workDir, accept);
      });
      fs.rmSync(path.join(basePath, id), { recursive: true, force: true });
    }
    const parsedOutput = JSON.parse(output);
    const result = new Array(Object.keys(parsedOutput).length);
    Object.entries(parsedOutput).forEach((e) => {
      const index = e[0].replace("output_input_", "").replace(".txt", "");
      result[index] = (e[1] as string).replace(/^\s+|\s+$/g, "");
    });
    return result;
  }

  async testCode(
    problemId: string,
    compiler: CompilerType,
    code: string,
    show_user: boolean = false,
  ): Promise<TestCodeResult> {
    const problem = await this.problemRepository.findOne({ where: { id: problemId } });
    let testcases: Testcase[];
    if (show_user)
      testcases = await this.testcaseRepository.find({ where: { problem, show_user } });
    else testcases = await this.testcaseRepository.find({ where: { problem } });

    const inputs = testcases.map((tc) => tc.input);
    const outputs = testcases.map((tc) => tc.output);

    const result = await this.runCode(compiler, code, inputs);

    const newTrim = (str: string) => {
      return str.trimEnd().replace("\n$", "").trimEnd();
    };

    return {
      passed: result.every((tco, i) => newTrim(tco) === newTrim(outputs[i])),
      testcases: outputs
        .map((output, i) => [newTrim(inputs[i]), newTrim(output), newTrim(result[i])])
        .filter((o) => o[2] !== o[3]),
    };
  }
}
