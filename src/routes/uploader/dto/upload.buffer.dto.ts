import { ApiProperty } from "@nestjs/swagger";

export class UploadBufferDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  data: string;
}
