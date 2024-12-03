import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Match")
@Controller("/match")
export class MatchController {}
