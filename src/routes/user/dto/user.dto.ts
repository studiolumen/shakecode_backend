import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

import { PermissionType } from "../../../common/types";

export class CreateUserDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nickname: string;
}

export class SetPermissionDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  permissions: PermissionType[];
}
export class AddPermissionDTO extends SetPermissionDTO {}
export class RemovePermissionDTO extends SetPermissionDTO {}
