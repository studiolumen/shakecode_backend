import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ErrorMsg } from "../../../common/error";
import { UploadBufferIdentifier, UserJWT } from "../../../common/types";
import { UploadBuffer, User } from "../../../schemas";

@Injectable()
export class UploadBufferService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UploadBuffer)
    private readonly uploadBufferRepository: Repository<UploadBuffer>,
  ) {}

  async createUploadBuffer(user: UserJWT, identifier: UploadBufferIdentifier) {
    const dbUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    const uploadBuffer = new UploadBuffer();
    uploadBuffer.user = dbUser;
    uploadBuffer.identifier = identifier;

    const buffer = await this.uploadBufferRepository.save(uploadBuffer);
    return buffer.id;
  }

  async appendDataToUploadBuffer(user: UserJWT, bufferId: string, data: string) {
    const uploadBuffer = await this.uploadBufferRepository.findOne({
      where: { id: bufferId },
    });

    if (!uploadBuffer) new HttpException(ErrorMsg.Resource_NotFound, HttpStatus.NOT_FOUND);
    if (uploadBuffer.user.id !== user.id) new HttpException(ErrorMsg.PermissionDenied_Action, HttpStatus.FORBIDDEN);

    uploadBuffer.data += data;
    await this.uploadBufferRepository.save(uploadBuffer);
  }

  async getUploadBufferData(user: UserJWT, bufferId: string, identifier: UploadBufferIdentifier) {
    const uploadBuffer = await this.uploadBufferRepository.findOne({
      where: { id: bufferId },
    });

    if (!uploadBuffer) new HttpException(ErrorMsg.Resource_NotFound, HttpStatus.NOT_FOUND);
    if (uploadBuffer.user.id !== user.id) new HttpException(ErrorMsg.PermissionDenied_Action, HttpStatus.FORBIDDEN);
    if (uploadBuffer.identifier !== identifier)
      new HttpException(ErrorMsg.PermissionDenied_Resource, HttpStatus.FORBIDDEN);

    await this.uploadBufferRepository.delete({ id: bufferId });

    return uploadBuffer.data;
  }
}
