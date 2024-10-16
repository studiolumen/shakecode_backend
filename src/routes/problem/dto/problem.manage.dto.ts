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
  testCases: TestCaseDTO[];
}
