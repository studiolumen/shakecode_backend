import { ApiProperty } from "@nestjs/swagger";

export class PasswordLogin {
  @ApiProperty()
  id: string;

  @ApiProperty()
  password: string;
}

export class JWTResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
