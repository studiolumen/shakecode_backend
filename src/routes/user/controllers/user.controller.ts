import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { CustomJwtAuthGuard } from "../../../auth/guards";
import {
  AddPermissionDTO,
  CreateUserDTO,
  RemovePermissionDTO,
  SetPermissionDTO,
} from "../dto";
import { UserService } from "../providers";

@ApiTags("User")
@Controller("/user")
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

  // TODO: permission set

  @ApiOperation({
    summary: "권한 설정",
    description: "유저 권한 설정",
  })
  @UseGuards(CustomJwtAuthGuard)
  @Post("/permission/set")
  async setPermission(@Body() data: SetPermissionDTO) {
    return await this.userManageService.setPermission(data);
  }

  @ApiOperation({
    summary: "권한 추가",
    description: "유저 권한 추가",
  })
  @UseGuards(CustomJwtAuthGuard)
  @Post("/permission/add")
  async addPermission(@Body() data: AddPermissionDTO) {
    return await this.userManageService.addPermission(data);
  }

  @ApiOperation({
    summary: "권한 제거",
    description: "유저 권한 제거",
  })
  @UseGuards(CustomJwtAuthGuard)
  @Post("/permission/remove")
  async removePermission(@Body() data: RemovePermissionDTO) {
    return await this.userManageService.removePermission(data);
  }
}
