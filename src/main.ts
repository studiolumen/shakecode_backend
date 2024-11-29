import { NestFactory } from "@nestjs/core";
import { json } from "express";

import { AppModule } from "./app";
import { CustomSwaggerSetup } from "./common/modules/swagger.module";
import { ValidationService } from "./common/modules/validation.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: "5000mb" }));
  app.enableCors();

  await CustomSwaggerSetup(app);

  await app.listen(process.env.NODE_ENV === "dev" ? 3001 : 3000);

  const validationService = app.get<ValidationService>(ValidationService);
  await validationService.validatePermissionEnum();
  await validationService.validateSession();
}
bootstrap();
