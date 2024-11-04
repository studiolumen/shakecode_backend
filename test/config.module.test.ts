import { Module } from "@nestjs/common";
import { ConfigModule, type ConfigModuleOptions } from "@nestjs/config";

export const options: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: ".env.dev",
};

@Module({ imports: [ConfigModule.forRoot(options)] })
export class CustomConfigTestModule {}