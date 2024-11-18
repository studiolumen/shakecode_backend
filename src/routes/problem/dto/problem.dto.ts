import { ApiProperty } from "@nestjs/swagger";

import { ProblemCategory, ProblemCategoryValues } from "../../../common/types";

export class TestCaseDTO {
  @ApiProperty()
  input: string;

  @ApiProperty()
  output: string;

  @ApiProperty()
  show_user: boolean;
}

export class CreateProblemDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: ProblemCategoryValues })
  category: ProblemCategory;

  @ApiProperty()
  difficulty: number;

  @ApiProperty({ description: "Unit: milliseconds" })
  time_limit: number;

  @ApiProperty({ description: "Unit: megabytes" })
  memory_limit: number;

  @ApiProperty({ type: TestCaseDTO })
  testcases: TestCaseDTO[];

  @ApiProperty()
  restricted: number;
}

export class CreateClassProblemDTO extends CreateProblemDTO {
  @ApiProperty()
  classId: number;
}

export class ProblemSummary {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  category: string;
}
