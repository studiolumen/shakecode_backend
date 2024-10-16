import { describe, beforeEach, it } from "node:test";

import { Test } from "@nestjs/testing";

import { ProblemService } from "../src/routes/problem/providers";

import { expect } from "./util";

describe("Problem service test", () => {
  let problemService: ProblemService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ProblemService],
    }).compile();
    problemService = moduleRef.get(ProblemService);
  });

  it("docker code run test", async () => {
    const gcc = await problemService.runCode(
      "gcc",
      // eslint-disable-next-line prettier/prettier
      "#include <stdio.h>\nint main() {\n  printf(\"hello world!\");\n}\n",
    );
    const node = await problemService.runCode(
      "node",
      // eslint-disable-next-line prettier/prettier
      "console.log(\"hello world!\")",
    );
    const python = await problemService.runCode(
      "python",
      // eslint-disable-next-line prettier/prettier
      "print(\"hello world!\")",
    );

    expect(gcc).toBe("hello world!");
    expect(node).toBe("hello world!");
    expect(python).toBe("hello world!");
  });
});
