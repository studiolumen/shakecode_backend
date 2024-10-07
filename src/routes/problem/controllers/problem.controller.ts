import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Problem")
@Controller("/problem")
export class ProblemController {}
