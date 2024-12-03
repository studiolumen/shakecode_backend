import { Body, Controller, Post, Req } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { CustomJwtAuthGuard } from "../../../auth/guards";
import { PermissionGuard } from "../../../auth/guards/permission.guard";
import { UseGuardsWithSwagger } from "../../../auth/guards/useGuards";
import { PermissionEnum } from "../../../common/types";
import { UploadBufferDTO } from "../dto/upload.buffer.dto";
import { UploadBufferService } from "../providers";

@ApiTags("Upload buffer")
@Controller("/upload")
export class UploadBufferController {
  constructor(private readonly uploadBufferService: UploadBufferService) {}

  @ApiOperation({
    summary: "upload buffer",
    description: "upload buffer",
  })
  @Post("/")
  @UseGuardsWithSwagger(
    CustomJwtAuthGuard,
    PermissionGuard([PermissionEnum.USE_UPLOAD_BUFFER]),
  )
  async createUploadBuffer(@Req() req, @Body() data: UploadBufferDTO) {
    return this.uploadBufferService.appendDataToUploadBuffer(
      req.user,
      data.id,
      data.data,
    );
  }
}
