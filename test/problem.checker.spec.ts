import { beforeEach, describe, it, expect, jest } from "@jest/globals";
import { Test } from "@nestjs/testing";

import { ProblemCheckerService } from "../src/routes/problem/providers";

jest.useRealTimers();

describe("Problem service test", () => {
  let problemCheckerService: ProblemCheckerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ProblemCheckerService],
    }).compile();
    problemCheckerService = moduleRef.get(ProblemCheckerService);
  });

  it("docker code run test - gcc", async () => {
    const gcc = await problemCheckerService.runCode(
      "gcc",
      // eslint-disable-next-line prettier/prettier
      "#include <stdio.h>\nint main() {\n  printf(\"hello world!\");\n}\n",
      [],
    );

    expect(gcc.trim()).toBe("hello world!");
  }, 180000);

  it("docker code run test - node", async () => {
    const node = await problemCheckerService.runCode(
      "node",
      // eslint-disable-next-line prettier/prettier
      "console.log(\"hello world!\")",
      [],
    );

    expect(node.trim()).toBe("hello world!");
  }, 180000);

  it("docker code run test - python", async () => {
    const python = await problemCheckerService.runCode(
      "python",
      // eslint-disable-next-line prettier/prettier
      "print(input())",
      ["hello world!"],
    );

    expect(python.trim()).toBe("hello world!");
  }, 180000);
});
