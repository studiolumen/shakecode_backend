import { beforeEach, describe, it, expect, jest } from "@jest/globals";
import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProblemCheckerService } from "../src/routes/problem/providers";
import { Problem, Testcase } from "../src/schemas";

import { EssentialTestModules } from "./modue.test";

jest.useRealTimers();

describe("Problem service test", () => {
  let problemCheckerService: ProblemCheckerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [...EssentialTestModules, TypeOrmModule.forFeature([Problem, Testcase])],
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

    expect(gcc[0]).toBe("hello world!");
  }, 180000);

  it("docker code run test - node", async () => {
    const node = await problemCheckerService.runCode(
      "node",
      // eslint-disable-next-line prettier/prettier
      "console.log('hello world!')",
      [],
      1024,
    );

    expect(node[0]).toBe("hello world!");
  }, 180000);

  it("docker code run test - python", async () => {
    const python = await problemCheckerService.runCode(
      "python",
      // eslint-disable-next-line prettier/prettier
      "print(input())",
      ["hello world!", "hello world?"],
    );

    expect(python[0]).toBe("hello world!");
    expect(python[1]).toBe("hello world?");
  }, 180000);
});
