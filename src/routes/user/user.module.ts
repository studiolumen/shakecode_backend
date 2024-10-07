import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import importToArray from "import-to-array";

import { Login, Session, User } from "../../schemas";

import * as userControllers from "./controllers";
import * as userServices from "./providers";

@Module({
  imports: [TypeOrmModule.forFeature([User, Login])],
  controllers: importToArray(userControllers),
  providers: [...importToArray(userServices)],
  exports: importToArray(userServices),
})
export class UserModule {}
