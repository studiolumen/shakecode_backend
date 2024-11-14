import { ApiProperty } from "@nestjs/swagger";

import { PermissionType } from "../../../common/types";

export class CreateUserDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  nickname: string;
}

export class SetPermissionDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  permissions: PermissionType[];
}
export class AddPermissionDTO extends SetPermissionDTO {}
export class RemovePermissionDTO extends SetPermissionDTO {}
