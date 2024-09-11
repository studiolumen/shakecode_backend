import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

import { LoginSchema } from "../schemas";

@Injectable()
export class AuthService {
  constructor(
    @Inject(LoginSchema.name)
    private loginSchema: Repository<LoginSchema>,
  ) {}

  // 암호화를 프론트에서 할 것 인가
  async getUserByIdPassword(id: string, password: string) {}
}
