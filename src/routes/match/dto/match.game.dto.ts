import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { IsEnum } from "nestjs-swagger-dto";

import { RedisMapper } from "../../../common/mapper/redis.mapper";
import { CompilerType, CompilerTypeValues } from "../../../common/mapper/types";

export class RunCodeDTO {
  @ApiProperty({ enum: RedisMapper })
  @IsString()
  @IsNotEmpty()
  matchType: RedisMapper;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  problemId: string;

  @ApiProperty({ enum: CompilerTypeValues })
  @IsString()
  @IsNotEmpty()
  compiler: CompilerType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;
}
