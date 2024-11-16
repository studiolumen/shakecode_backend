import { beforeEach, describe, it, expect, jest } from "@jest/globals";
import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CreateProblemDTO } from "../src/routes/problem/dto/problem.dto";
import { ProblemService } from "../src/routes/problem/providers";
import { CreateUserDTO } from "../src/routes/user/dto";
import { UserService } from "../src/routes/user/providers";
import { Login, Problem, TestCase, User } from "../src/schemas";

import { EssentialTestModules } from "./modue.test";

// jest.useRealTimers();

describe("Problem manage service test", () => {
  let problemService: ProblemService;
  let userManageService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ...EssentialTestModules,
        TypeOrmModule.forFeature([Login, User, Problem, TestCase]),
      ],
      providers: [UserService, ProblemService],
    }).compile();
    problemService = moduleRef.get(ProblemService);
    userManageService = moduleRef.get(UserService);
  });

  it("problem creation test", async () => {
    const userCriteria = "problem test";
    const userCreationInfo = new CreateUserDTO();
    userCreationInfo.name = userCriteria;
    userCreationInfo.nickname = userCriteria;
    userCreationInfo.password = userCriteria;
    userCreationInfo.email = userCriteria;
    const user = await userManageService.createUser(userCreationInfo);

    const cpdto = new CreateProblemDTO();
    cpdto.name = "test";
    cpdto.description = "test";
    cpdto.category = "basic";
    cpdto.time_limit = 1000;
    cpdto.memory_limit = 100;
    cpdto.difficulty = 1;
    cpdto.testCases = [
      {
        input: "",
        output: "hello world",
        show_user: true,
      },
      {
        input: "",
        output: "hello world",
        show_user: false,
      },
    ];
    cpdto.restricted = 0;

    const problem = await problemService.createProblem(user, cpdto);
    const result = await problemService.deleteProblem(problem.id);

    await userManageService.deleteUser(user.id);

    expect("test").toBe("test");
  });
});
