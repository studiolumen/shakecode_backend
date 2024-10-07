import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JWTResponse, PasswordLogin } from "./auth.dto";
import { AuthService } from "./auth.service";

@ApiTags("Auth")
@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: "핑",
    description: "서버가 살아있는지 테스트합니다.",
  })
  async ping() {
    return "퐁";
  }

  @ApiOperation({
    summary: "로그인 - 비밀번호",
    description: "비밀번호를 이용한 로그인입니다.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: JWTResponse,
  })
  @Post("/login/password")
  async passwordLogin(@Body() data: PasswordLogin) {
    return await this.authService.loginByIdPassword(data.id, data.password);
  }
}
