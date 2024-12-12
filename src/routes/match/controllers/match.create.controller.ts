import { Controller, HttpStatus, Post, Req } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CustomJwtAuthGuard } from "../../../auth/guards";
import { PermissionGuard } from "../../../auth/guards/permission.guard";
import { UseGuardsWithSwagger } from "../../../auth/guards/useGuards";
import { PermissionEnum } from "../../../common/mapper/permissions";
import { MatchQueueService } from "../providers";

@ApiTags("Match Create")
@Controller("/match/create")
export class MatchCreateController {
  constructor(private readonly matchQueueService: MatchQueueService) {}

  @ApiOperation({
    summary: "private room",
    description: "create new private room and obtain init socket id",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Init socket id",
    type: String,
  })
  @Post("/private")
  @UseGuardsWithSwagger(CustomJwtAuthGuard, PermissionGuard([PermissionEnum.CREATE_PRIVATE_ROOM]))
  async createPrivateRoom(@Req() req) {
    return this.matchQueueService.createPrivateRoom(req.user);
  }
}
