import { HttpException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { v4 as uuid } from "uuid";

import { ErrorMsg } from "../common/error";
import { UserJWT } from "../common/mapper/types";
import { Login, Session, User } from "../schemas";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Login)
    private readonly loginRepository: Repository<Login>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async loginByIdPassword(id: string, password: string) {
    const login = await this.loginRepository.findOne({
      where: { identifier1: id || "" },
    });
    if (!login) throw new HttpException(ErrorMsg.UserIdentifier_NotFound, 403);
    if (!bcrypt.compareSync(password, login.identifier2))
      throw new HttpException(ErrorMsg.UserIdentifier_NotMatched, 403);

    return await this.generateJWTKeyPair(login.user, "30m", "1y");
  }

  async refresh(refreshToken: string) {
    const session = await this.sessionRepository.findOne({
      where: { refreshToken: refreshToken || "" },
    });
    if (!session)
      throw new HttpException("Session not found. Is this valid jwt refresh token?", 404);

    await this.sessionRepository.delete(session);

    const user = await this.userRepository.findOne({
      where: { id: session.user.id },
    });

    return await this.generateJWTKeyPair(user, "30m", "1M");
  }

  async logout(user: UserJWT) {
    const session = await this.sessionRepository.findOne({
      where: { sessionIdentifier: user.sessionIdentifier || "" },
    });
    // cannot be called. if called, it's a bug. (jwt strategy should catch this)
    if (!session) throw new HttpException("Cannot find valid session.", 404);

    await this.sessionRepository.delete(session);

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
        { expiresIn: accessExpire || "10m" },
      ),
      refreshToken: await this.jwtService.signAsync(
        { sessionIdentifier, id: user.id, refresh: true },
        { expiresIn: refreshExpire || "5h" },
      ),
    };

    // TODO: separate to redis
    const session = new Session();
    session.accessToken = keyPair.accessToken;
    session.refreshToken = keyPair.refreshToken;
    session.sessionIdentifier = sessionIdentifier;
    session.user = user;
    await this.sessionRepository.save(session);

    return keyPair;
  }
}
