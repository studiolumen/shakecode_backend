import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsString,
} from "class-validator";

import { ProblemCategory, ProblemCategoryValues } from "../../../common/types";

export class TestCaseDTO {
  @ApiProperty()
  @IsString()
  input: string;

  @ApiProperty()
  @IsString()
  output: string;

  @ApiProperty()
  @IsBoolean()
  show_user: boolean;
}

export class CreateProblemDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: ProblemCategoryValues })
  @IsString()
  category: ProblemCategory;

  @ApiProperty()
  difficulty: number;

  @ApiProperty({ description: "Unit: milliseconds" })
  @IsNumber()
  time_limit: number;

  @ApiProperty({ description: "Unit: megabytes" })
  @IsNumber()
  memory_limit: number;

  @ApiProperty({ type: TestCaseDTO })
  @IsArray()
  testcases: TestCaseDTO[];

  @ApiProperty()
  @IsNumber()
  restricted: number;
}

export class UpdateProblemDTO extends CreateProblemDTO {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  pid: number; // public problem id
}

export class CreateClassProblemDTO extends CreateProblemDTO {
  @ApiProperty()
  @IsNumber()
  classId: number;
}

export class ProblemSummary {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  category: string;
}

export class DeleteProblemDTO {
  @ApiProperty()
  @IsNumber()
  id: number;
}
