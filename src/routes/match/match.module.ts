import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import importToArray from "import-to-array";

import { ClassProblem, Problem, TestCase, User } from "../../schemas";

import * as controllers from "./controllers";
import * as gateways from "./gateways";
import * as providers from "./providers";

@Module({
  imports: [TypeOrmModule.forFeature([User, Problem, TestCase, ClassProblem])],
  controllers: importToArray(controllers),
  providers: [...importToArray(providers), ...importToArray(gateways)],
  exports: [...importToArray(providers), ...importToArray(gateways)],
})
export class MatchModule {}
