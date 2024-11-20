import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";

import { PermissionType } from "../../../common/types";

export class CreateUserDTO {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  nickname: string;
}

export class SetPermissionDTO {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsArray()
  permissions: PermissionType[];
}
export class AddPermissionDTO extends SetPermissionDTO {}
export class RemovePermissionDTO extends SetPermissionDTO {}
