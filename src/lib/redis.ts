import Redis from "ioredis";

const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USER,
  db: 0,
};

export class RedisSingleton {
  private static instance: Redis;

  private constructor() {} // block "new RedisSingleton()"

  public static getInstance(): Redis {
    if (!RedisSingleton.instance) {
      RedisSingleton.instance = new Redis(redisConfig);

      // Events
      RedisSingleton.instance.on("error", (error) => {
        console.error("Redis connection error:", error);
      });

      RedisSingleton.instance.on("connect", () => {
        console.log("Redis connected successfully");
      });

      RedisSingleton.instance.on("ready", () => {
        console.log("Redis is ready to accept commands");
      });

      RedisSingleton.instance.on("close", () => {
        console.log("Redis connection closed");
      });

      // Graceful shutdown
      process.on("SIGINT", async () => {
        console.log("Shutting down Redis connection...");
        await RedisSingleton.instance.quit();
        process.exit(0);
      });

      process.on("SIGTERM", async () => {
        console.log("Shutting down Redis connection...");
        await RedisSingleton.instance.quit();
        process.exit(0);
      });
    }
    return RedisSingleton.instance;
  }

  public static isConnected(): boolean {
    return RedisSingleton.instance?.status === "ready";
  }

  public static async safeOperation<T>(
    operation: () => Promise<T>,
    fallback?: T,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.error("Redis operation failed:", error);
      if (fallback !== undefined) {
        return fallback;
      }
      throw error;
    }
  }
}

export default RedisSingleton;
