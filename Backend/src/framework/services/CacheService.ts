import { ICacheService } from "../../domain/sevices/ICacheService";

import Redis from "ioredis";

export class CacheService implements ICacheService {
  private _redisClient: Redis;

  constructor() {
    this._redisClient = new Redis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    });

    this._redisClient.on("error", (err) =>
      console.log(err instanceof Error && err.message)
    );

    this._redisClient.on("connect", () => console.log("redis connected"));

    this._redisClient.on("disconnect", () => console.log("redis disconnected"));
  }

  async connect() {
    if (!this._redisClient.status) {
      await this._redisClient.connect();
    }
  }
  async setValue(key: string, value: string): Promise<void> {
    if (!this._redisClient.status) {
      await this.connect();
    }
    this._redisClient.set(key, value);
  }
  async setWithExpiry(key: string, value: string, time: number): Promise<void> {
    if (!this._redisClient.status) {
      await this.connect();
    }
    this._redisClient.setex(key, time, value);
  }
  async getValue(key: string): Promise<string | null> {
    if (!this._redisClient.status) {
      await this.connect();
    }

    return await this._redisClient.get(key);
  }
  async deleteValue(key: string): Promise<void> {
    if (!this._redisClient.status) {
      await this.connect();
    }
    await this._redisClient.del(key);
  }
}
