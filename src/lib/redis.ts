import Redis from "ioredis";

const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USER,
  db: 0,
};

export const redis = new Redis(redisConfig);

redis.on("error", (error) => {
  console.error("Redis connection error:", error);
});

redis.on("connect", () => {
  console.log("Redis connected successfully");
});

redis.on("ready", () => {
  console.log("Redis is ready to accept commands");
});

redis.on("close", () => {
  console.log("Redis connection closed");
});

process.on("SIGINT", async () => {
  console.log("Shutting down Redis connection...");
  await redis.quit();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down Redis connection...");
  await redis.quit();
  process.exit(0);
});

export const isRedisConnected = (): boolean => {
  return redis.status === "ready";
};

export const safeRedisOperation = async <T>(
  operation: () => Promise<T>,
  fallback?: T,
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    console.error("Redis operation failed:", error);
    if (fallback !== undefined) {
      return fallback;
    }
    throw error;
  }
};
