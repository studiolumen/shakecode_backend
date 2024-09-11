import { CustomConfigModule } from "./config.module";
import { CustomDatabaseModule } from "./database.module";
import { CustomJWTModule } from "./jwt.module";
import { CustomScheduleModule } from "./schedule.module";

export const CustomEssentialModules = [
  CustomConfigModule,
  CustomDatabaseModule,
  CustomScheduleModule,
  CustomJWTModule,
];
