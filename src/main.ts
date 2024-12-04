import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { json } from "express";

import { AppModule } from "./app";
import { CustomSwaggerSetup } from "./common/modules/swagger.module";
import { ValidationService } from "./common/modules/validation.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));
  app.useGlobalPipes(new ValidationPipe());
  app.use(json({ limit: "5000mb" }));
  app.enableCors();

  await CustomSwaggerSetup(app);

  const validationService = app.get<ValidationService>(ValidationService);
  await validationService.validatePermissionEnum();
  await validationService.validateSession();

  const configService = app.get(ConfigService);
  const port = configService.get("PORT");

  await app.listen(port);
}
bootstrap();
