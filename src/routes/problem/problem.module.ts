import { Module } from "@nestjs/common";
import importToArray from "import-to-array";

import * as problemControllers from "./controllers";
import * as problemServices from "./providers";

@Module({
  imports: [],
  controllers: importToArray(problemControllers),
  providers: importToArray(problemServices),
  exports: importToArray(problemServices),
})
export class ProblemModule {}
