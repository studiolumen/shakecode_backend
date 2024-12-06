import * as child_process from "child_process";
import * as fs from "fs";
import * as path from "path";

import { Injectable } from "@nestjs/common";
import { v4 as uuid } from "uuid";

import { CompilerType } from "../../../common/types";

@Injectable()
export class ProblemCheckerService {
  constructor() {}

  async runCode(
    type: CompilerType,
    code: string,
    inputs: string[],
  ): Promise<string> {
    const id = uuid();
    const basePath = path.join(__dirname, "../../../common/docker");
    const workDir = { cwd: path.join(basePath, id) };

    let result: string;
    try {
      fs.mkdirSync(path.join(basePath, id));
      fs.copyFileSync(
        path.join(basePath, `Dockerfile_${type}`),
        path.join(basePath, id, "Dockerfile"),
      );
      fs.writeFileSync(path.join(basePath, id, "code"), code, {
        flag: "w",
      });
      for (let i = 0; i < inputs.length; i++) {
        fs.writeFileSync(path.join(basePath, id, `input_${i}.txt`), inputs[i]);
      }
      await new Promise((accept) => {
        child_process.exec(`docker build . -t ${id}`, workDir, accept);
      });
      await new Promise((accept) => {
        child_process.exec(`docker run --name ${id} ${id}`, workDir, accept);
      });
      result = await new Promise((accept) => {
        child_process.exec(
          `docker logs ${id}`,
          workDir,
          (error, stdout, stderror) => {
            accept(stdout + "\n" + stderror);
          },
        );
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
    return result;
  }
}
