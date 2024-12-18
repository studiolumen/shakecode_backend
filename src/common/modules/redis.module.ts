import { CACHE_MANAGER, CacheModule } from "@nestjs/cache-manager";
import { Inject, Injectable, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CachingConfig, Cache } from "cache-manager";
import * as redisStore from "cache-manager-redis-store";

import { CustomConfigModule } from "./config.module";

const cacheModule = CacheModule.register({
  imports: [CustomConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    store: redisStore,
    host: configService.get<string>("REDIS_HOST"),
    port: configService.get<number>("REDIS_PORT"),
    password: configService.get<string>("REDIS_PASS"),
  }),
});

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(key: string): Promise<any> {
    return await this.cache.get(key);
  }

  async getJSON<T>(key: string): Promise<T> {
    return JSON.parse(await this.get(key)) as T;
  }

  async set(key: string, value: any, option?: CachingConfig<any>) {
    await this.cache.set(key, value, { ttl: 3600, ...option });
  }

  async setJSON(key: string, value: any, option?: CachingConfig<any>) {
    await this.set(key, JSON.stringify(value), option);
  }

  async reset() {
    await this.cache.reset();
  }

  async del(key: string) {
    await this.cache.del(key);
  }
}

@Module({
  imports: [cacheModule],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class CustomRedisModule {}
