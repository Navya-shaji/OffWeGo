import { ICacheService } from "../../domain/sevices/ICacheService";
import Redis from "ioredis";
import NodeCache from "node-cache";

export class CacheService implements ICacheService {
  private _redisClient: Redis;
  private _localCache: NodeCache;
  private _useLocalCache: boolean = false;

  constructor() {
    this._localCache = new NodeCache({ stdTTL: 600 }); // 10 minutes default TTL

    this._redisClient = new Redis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: 1,
      lazyConnect: true,
      retryStrategy: (times) => {
        if (times > 1) {
          if (!this._useLocalCache) {
            console.warn("⚠️ CacheService: Redis unavailable. Falling back to In-Memory Cache.");
            this._useLocalCache = true;
          }
          return null; // Stop retrying
        }
        return 100;
      }
    });

    this._redisClient.on("error", (err) => {
      if (!this._useLocalCache) {
        console.error("Redis error in CacheService:", err instanceof Error ? err.message : err);
      }
    });

    this._redisClient.on("connect", () => {
      console.log("✅ Redis connected in CacheService");
      this._useLocalCache = false;
    });
  }

  async connect() {
    if (this._useLocalCache) return;
    try {
      if (this._redisClient.status === "wait" || !this._redisClient.status) {
        await this._redisClient.connect();
      }
    } catch {
      this._useLocalCache = true;
    }
  }

  async setValue(key: string, value: string): Promise<void> {
    if (this._useLocalCache) {
      this._localCache.set(key, value);
      return;
    }
    try {
      await this._redisClient.set(key, value);
    } catch {
      this._useLocalCache = true;
      this._localCache.set(key, value);
    }
  }

  async setWithExpiry(key: string, value: string, time: number): Promise<void> {
    if (this._useLocalCache) {
      this._localCache.set(key, value, time);
      return;
    }
    try {
      await this._redisClient.setex(key, time, value);
    } catch {
      this._useLocalCache = true;
      this._localCache.set(key, value, time);
    }
  }

  async getValue(key: string): Promise<string | null> {
    if (this._useLocalCache) {
      const val = this._localCache.get<string>(key);
      return val !== undefined ? val : null;
    }
    try {
      return await this._redisClient.get(key);
    } catch {
      this._useLocalCache = true;
      const val = this._localCache.get<string>(key);
      return val !== undefined ? val : null;
    }
  }

  async deleteValue(key: string): Promise<void> {
    if (this._useLocalCache) {
      this._localCache.del(key);
      return;
    }
    try {
      await this._redisClient.del(key);
    } catch {
      this._useLocalCache = true;
      this._localCache.del(key);
    }
  }
}
