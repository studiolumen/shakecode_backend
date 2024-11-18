import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app";
import { CustomSwaggerSetup } from "./common/modules/swagger.module";
import { ValidationService } from "./common/modules/validation.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  await CustomSwaggerSetup(app);

  await app.listen(3000);

  const validationService = app.get<ValidationService>(ValidationService);
  await validationService.validatePermissionEnum();
  await validationService.validateSession();
}
bootstrap();
