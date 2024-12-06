import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import importToArray from "import-to-array";

import { CustomRedisModule } from "../../common/modules/redis.module";
import { MatchQueue, User } from "../../schemas";

import * as controllers from "./controllers";
import * as gateways from "./gateways";
import * as providers from "./providers";

@Module({
  imports: [TypeOrmModule.forFeature([User, MatchQueue]), CustomRedisModule],
  controllers: importToArray(controllers),
  providers: [...importToArray(providers), ...importToArray(gateways)],
  exports: [...importToArray(providers), ...importToArray(gateways)],
})
export class MatchModule {}
