import { beforeEach, describe, it, expect, jest } from "@jest/globals";
import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProblemService } from "../src/routes/problem/providers";
import { Login, Problem, TestCase, User } from "../src/schemas";

import { EssentialTestModules } from "./modue.test";

jest.useRealTimers();

describe("Problem service test", () => {
  let problemService: ProblemService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ...EssentialTestModules,
        TypeOrmModule.forFeature([Login, User, Problem, TestCase]),
      ],
      providers: [ProblemService],
    }).compile();
    problemService = moduleRef.get(ProblemService);
  });

  it("docker code run test - gcc", async () => {
    const gcc = await problemService.runCode(
      "gcc",
      // eslint-disable-next-line prettier/prettier
      "#include <stdio.h>\nint main() {\n  printf(\"hello world!\");\n}\n",
      [],
    );

    expect(gcc.trim()).toBe("hello world!");
  }, 180000);

  it("docker code run test - node", async () => {
    const node = await problemService.runCode(
      "node",
      // eslint-disable-next-line prettier/prettier
      "console.log(\"hello world!\")",
      [],
    );

    expect(node.trim()).toBe("hello world!");
  }, 180000);

  it("docker code run test - python", async () => {
    const python = await problemService.runCode(
      "python",
      // eslint-disable-next-line prettier/prettier
      "print(input())",
      ["hello world!"],
    );

    expect(python.trim()).toBe("hello world!");
  }, 180000);
});
