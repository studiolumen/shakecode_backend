import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CustomConfigModule } from "../common/modules/config.module";
import { CustomJWTModule } from "../common/modules/jwt.module";
import { UserManageService } from "../routes/user/providers/user.manage.service";
import { Login, Session, User } from "../schemas";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { CustomJwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([Login, Session, User]),
    CustomJWTModule,
    CustomConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, CustomJwtStrategy, UserManageService],
  exports: [AuthService],
})
export class AuthModule {}
