import { HttpException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { v4 as uuid } from "uuid";

import { UserError } from "../routes/user/error";
import { Login, Session, User } from "../schemas";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Login)
    private readonly loginRepository: Repository<Login>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
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

  async refresh(refreshToken: string) {
    const session = await this.sessionRepository.findOne({
      where: { refreshToken },
    });
    if (!session)
      throw new HttpException(
        "Session not found. Is this valid jwt refresh token?",
        404,
      );

    await this.sessionRepository.delete(session.id);

    return await this.generateJWTKeyPair(session.user, "30m", "1y");
  }

  async logout(accessToken: string) {
    const session = await this.sessionRepository.findOne({
      where: { accessToken },
    });
    // cannot be called. if called, it's a bug. (jwt strategy should catch this)
    if (!session) throw new HttpException("Cannot find valid session.", 404);

    await this.sessionRepository.delete(session.id);

    return session;
  }

  async generateJWTKeyPair(
    user: User,
    accessExpire: string,
    refreshExpire: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const sessionIdentifier = uuid().replaceAll("-", "");

    const keyPair = {
      accessToken: await this.jwtService.signAsync(
        { sessionIdentifier, ...user, refresh: false },
        { expiresIn: accessExpire || "30m" },
      ),
      refreshToken: await this.jwtService.signAsync(
        { sessionIdentifier, ...user, refresh: true },
        { expiresIn: refreshExpire || "1y" },
      ),
    };

    const session = new Session();
    session.accessToken = keyPair.accessToken;
    session.refreshToken = keyPair.refreshToken;
    session.sessionIdentifier = sessionIdentifier;
    session.user = user;
    await this.sessionRepository.save(session);

    return keyPair;
  }
}