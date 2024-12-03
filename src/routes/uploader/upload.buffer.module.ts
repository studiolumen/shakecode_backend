import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import importToArray from "import-to-array";

import { UploadBuffer, User } from "../../schemas";
import * as problemServices from "../problem/providers";

import * as classControllers from "./controllers";
import * as classServices from "./providers";

@Module({
  imports: [TypeOrmModule.forFeature([User, UploadBuffer])],
  controllers: importToArray(classControllers),
  providers: importToArray(classServices),
  exports: importToArray(problemServices),
})
export class UploadBufferModule {}
