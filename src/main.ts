import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app";
import { CustomSwaggerSetup } from "./common/modules/swagger.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await CustomSwaggerSetup(app);

  await app.listen(3000);
}
bootstrap();
