import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import importToArray from "import-to-array";

import { Login, Problem, TestCase, User } from "../../schemas";

import * as problemControllers from "./controllers";
import * as problemServices from "./providers";

@Module({
  imports: [TypeOrmModule.forFeature([User, Problem, TestCase])],
  controllers: importToArray(problemControllers),
  providers: importToArray(problemServices),
  exports: importToArray(problemServices),
})
export class ProblemModule {}
