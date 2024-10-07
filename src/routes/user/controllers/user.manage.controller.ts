import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { CustomJwtAuthGuard } from "../../../auth/guards";
import { CreateUserDTO } from "../dto";
import { UserManageService } from "../providers";

@ApiTags("User Manage")
@Controller("/manage/user")
export class UserManageController {
  constructor(private readonly userManageService: UserManageService) {}

  @ApiOperation({
    summary: "회원가입",
    description: "유저 및 로그인 정보 생성",
  })
  // @UseGuards(CustomJwtAuthGuard)
  @Post("/register")
  async register(@Body() data: CreateUserDTO) {
    return await this.userManageService.createUser(data);
  }
}
