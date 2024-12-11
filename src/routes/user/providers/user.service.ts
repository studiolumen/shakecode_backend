import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import merge from "merge-js-class";
import { Repository } from "typeorm";

import { PermissionType } from "../../../common/mapper/permissions";
import { numberPermission, parsePermission } from "../../../common/utils/permission.util";
import { Login, User } from "../../../schemas";
import { AddPermissionDTO, CreateUserDTO, RemovePermissionDTO, SetPermissionDTO } from "../dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Login)
    private readonly loginRepository: Repository<Login>,
  ) {}

  async getUserById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async createUser(data: CreateUserDTO): Promise<User> {
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

  async deleteUser(id: string): Promise<User> {
    const user = await this.getUserById(id);
    return await this.userRepository.remove(user);
  }

  // this bunch of code can be shortened.
  // but I left it like this for optimization.
  async setPermission(data: SetPermissionDTO) {
    const user = await this.userRepository.findOne({ where: { id: data.id } });
    user.permission = numberPermission(...data.permissions);

    return await this.userRepository.save(user);
  }

  async addPermission(data: AddPermissionDTO) {
    const user = await this.userRepository.findOne({ where: { id: data.id } });

    const permissions = parsePermission(user.permission);

    const addPermissionTarget = data.permissions.filter(
      (p: PermissionType) => !permissions.find((p2) => p2 === p),
    );

    const resultPermission = [].concat(permissions, addPermissionTarget);

    user.permission = numberPermission(...resultPermission);

    return await this.userRepository.save(user);
  }

  async removePermission(data: RemovePermissionDTO) {
    const user = await this.userRepository.findOne({ where: { id: data.id } });

    const resultPermissions = parsePermission(user.permission).filter(
      (p: PermissionType) => !data.permissions.find((p2) => p2 === p),
    ) as PermissionType[];

    user.permission = numberPermission(...resultPermissions);

    return await this.userRepository.save(user);
  }
}
