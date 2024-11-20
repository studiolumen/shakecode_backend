import { ApiProperty } from "@nestjs/swagger";

export class PasswordLoginDTO {
  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  password: string;
}

export class RefreshTokenDTO {
  @ApiProperty({ required: true })
  refreshToken: string;
}

export class JWTResponse {
  @ApiProperty({ required: true })
  accessToken: string;

  @ApiProperty({ required: true })
  refreshToken: string;
}
