import { ApiProperty } from "@nestjs/swagger";

import { ProblemCategory, ProblemCategoryValues } from "../../../common/types";

export class TestCaseDTO {
  @ApiProperty()
  input: string;

  @ApiProperty({ required: true })
  output: string;

  @ApiProperty({ required: true })
  show_user: boolean;
}

export class CreateProblemDTO {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  description: string;

  @ApiProperty({ type: ProblemCategoryValues })
  category: ProblemCategory;

  @ApiProperty({ required: true })
  difficulty: number;

  @ApiProperty({ description: "Unit: milliseconds" })
  time_limit: number;

  @ApiProperty({ description: "Unit: megabytes" })
  memory_limit: number;

  @ApiProperty({ type: TestCaseDTO })
  testcases: TestCaseDTO[];

  @ApiProperty({ required: true })
  restricted: number;
}

export class UpdateProblemDTO extends CreateProblemDTO {
  @ApiProperty({ required: true })
  id: number;

  @ApiProperty({ required: true })
  pid: number; // public problem id
}

export class CreateClassProblemDTO extends CreateProblemDTO {
  @ApiProperty({ required: true })
  classId: number;
}

export class ProblemSummary {
  @ApiProperty({ required: true })
  id: number;

  @ApiProperty({ required: true })
  title: string;

  @ApiProperty({ required: true })
  description: string;

  @ApiProperty({ required: true })
  category: string;
}

export class DeleteProblemDTO {
  @ApiProperty({ required: true })
  id: number;
}
