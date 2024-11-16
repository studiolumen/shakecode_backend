import { ApiProperty } from "@nestjs/swagger";

export class PasswordLoginDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class RefreshTokenDTO {
  @ApiProperty()
  refreshToken: string;
}

export class JWTResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
