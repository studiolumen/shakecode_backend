import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import importToArray from "import-to-array";

import { UploadBuffer, User } from "../../schemas";

import * as controllers from "./controllers";
import * as providers from "./providers";

@Module({
  imports: [TypeOrmModule.forFeature([User, UploadBuffer])],
  controllers: importToArray(controllers),
  providers: importToArray(providers),
  exports: importToArray(providers),
})
export class UploadBufferModule {}
