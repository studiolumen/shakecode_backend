import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

import { UserSchema } from "../../../schemas";

@Injectable()
export class UserManageService {
  constructor(
    @Inject(UserSchema.name)
    private userSchema: Repository<UserSchema>,
  ) {}

  async getUserById(id: number) {
    return await this.userSchema.findOne({ where: { id } });
  }
}
