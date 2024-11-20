import { ApiProperty } from "@nestjs/swagger";

import { PermissionType } from "../../../common/types";

export class CreateUserDTO {
  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  password: string;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  nickname: string;
}

export class SetPermissionDTO {
  @ApiProperty({ required: true })
  id: number;

  @ApiProperty({ required: true })
  permissions: PermissionType[];
}
export class AddPermissionDTO extends SetPermissionDTO {}
export class RemovePermissionDTO extends SetPermissionDTO {}
