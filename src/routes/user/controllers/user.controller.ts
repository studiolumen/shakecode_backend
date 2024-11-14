import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { CreateUserDTO } from "../dto";
import { UserService } from "../providers";

@ApiTags("User Manage")
@Controller("/manage/user")
export class UserController {
  constructor(private readonly userManageService: UserService) {}

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
