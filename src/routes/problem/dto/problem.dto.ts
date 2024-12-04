import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
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

export class getTestcasesDTO {
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

export class ProblemIdDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class GetProblemListDTO {
  @ApiProperty()
  @IsBoolean()
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
  @IsOptional()
  hidden: boolean = true;
}
