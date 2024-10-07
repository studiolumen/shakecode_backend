import { HttpException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";

import { UserError } from "../routes/user/error";
import { Login, Session, User } from "../schemas";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Login)
    private loginRepository: Repository<Login>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async loginByIdPassword(id: string, password: string) {
    const login = await this.loginRepository.findOne({
      relations: { user: true },
      where: { identifier1: id },
    });
    if (!login)
      throw new HttpException(UserError.UserIdentifier_NotMatched, 403);
    if (!bcrypt.compareSync(password, login.identifier2))
      throw new HttpException(UserError.UserIdentifier_NotMatched, 403);

    return await this.generateJWTKeyPair(login.user, "30m", "1y");
  }

  async generateJWTKeyPair(
    user: User,
    accessExpire: string,
    refreshExpire: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const keyPair = {
      accessToken: await this.jwtService.signAsync(
        { ...user, refresh: false },
        { expiresIn: accessExpire || "30m" },
      ),
      refreshToken: await this.jwtService.signAsync(
        { ...user, refresh: true },
        { expiresIn: refreshExpire || "1y" },
      ),
    };

    const session = new Session();
    session.id = user.id;
    session.accessToken = keyPair.accessToken;
    session.refreshToken = keyPair.refreshToken;
    session.user = user;

    await this.sessionRepository.save(session);

    return keyPair;
  }
}
