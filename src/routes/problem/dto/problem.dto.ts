import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

import { ProblemCategory, ProblemCategoryValues } from "../../../common/mapper/types";
import { TestCase, User } from "../../../schemas";

export class TestCaseDTO {
  @ApiProperty()
  @IsString()
  input: string;

  @ApiProperty()
  @IsString()
  output: string;

  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => value === "true")
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

  @ApiProperty({ type: ProblemCategoryValues, enumName: "ProblemCategory" })
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
  testcases: TestCaseDTO[];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  restricted: number;
}

export class UpdateProblemDTO extends CreateProblemDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  pid: number; // public problem id
}

export class CreateClassProblemDTO extends CreateProblemDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  classId: string;
}

export class ProblemSummary {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

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

export class GetTestcasesDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(0)
  from: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(0)
  count: number;
}

export class TestcaseIdDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class ProblemIdDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class GetProblemListDTO {
  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @IsOptional()
  all: boolean = false;
}

export class GetFullProblemDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @IsOptional()
  hidden: boolean = true;
}

export class TestcaseListResponseDTO {
  @ApiProperty({ type: [TestCaseDTO] })
  @IsArray()
  testcases: TestCaseDTO[];

  @ApiProperty()
  @IsNumber()
  count: number;
}

export class ProblemCheckResult {
  @ApiProperty()
  id: string;

  @ApiProperty()
  pid?: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: ProblemCategoryValues, enumName: "ProblemCategory" })
  category: ProblemCategory;

  @ApiProperty()
  difficulty: number;

  @ApiProperty()
  time_limit: number;

  @ApiProperty()
  memory_limit: number;

  @ApiProperty()
  restricted: number;

  @ApiProperty({ type: [TestCase] })
  testCases: TestCase[];

  @ApiProperty()
  testcasesCount: number;

  @ApiProperty({ type: User })
  user: User;
}
