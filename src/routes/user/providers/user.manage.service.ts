import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import merge from "merge-js-class";
import { Repository } from "typeorm";

import { Login, User } from "../../../schemas";
import { CreateUserDTO } from "../dto";

@Injectable()
export class UserManageService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Login)
    private readonly loginRepository: Repository<Login>,
  ) {}

  async getUserById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async createUser(data: CreateUserDTO) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = new User();
    await merge(user, data);

    const login = new Login();
    login.type = "password";
    login.identifier1 = data.email;
    login.identifier2 = hashedPassword;
    login.user = user;

    await this.userRepository.save(user);
    await this.loginRepository.save(login);

    return user;
  }

  async deleteUser(id: number) {
    const user = await this.getUserById(id);
    await this.userRepository.remove(user);
  }
}
