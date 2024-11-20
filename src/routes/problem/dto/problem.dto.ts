import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
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
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: ProblemCategoryValues })
  @IsString()
  @IsNotEmpty()
  category: ProblemCategory;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  difficulty: number;

  @ApiProperty({ description: "Unit: milliseconds" })
  @IsNumber()
  @IsNotEmpty()
  time_limit: number;

  @ApiProperty({ description: "Unit: megabytes" })
  @IsNumber()
  @IsNotEmpty()
  memory_limit: number;

  @ApiProperty({ type: TestCaseDTO })
  @IsArray()
  @IsNotEmpty()
  testcases: TestCaseDTO[];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  restricted: number;
}

export class UpdateProblemDTO extends CreateProblemDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  pid: number; // public problem id
}

export class CreateClassProblemDTO extends CreateProblemDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  classId: number;
}

export class ProblemSummary {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category: string;
}

export class DeleteProblemDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
