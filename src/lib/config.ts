import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SHOPEEXTRA_PREFIX: z.string().url().optional(),
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z
    .string()
    .transform(Number)
    .pipe(z.number().positive())
    .default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_USER: z.string().optional(),
  SHOPEEXTRA_API_KEY: z.string().min(1).optional(),
  SHOPEEXTRA_API_SECRET: z.string().min(1).optional(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const envValidation = envSchema.safeParse(process.env);

if (!envValidation.success) {
  console.error("Invalid environment variables:", envValidation.error.format());
  throw new Error("Invalid environment variables");
}

export const config = envValidation.data;

// Validate ShopeeExtra config at runtime, not build time
export const validateShopeeExtraConfig = () => {
  if (!config.NEXT_PUBLIC_SHOPEEXTRA_PREFIX) {
    throw new Error("NEXT_PUBLIC_SHOPEEXTRA_PREFIX is required");
  }
  if (!config.SHOPEEXTRA_API_KEY) {
    throw new Error("SHOPEEXTRA_API_KEY is required");
  }
  if (!config.SHOPEEXTRA_API_SECRET) {
    throw new Error("SHOPEEXTRA_API_SECRET is required");
  }
};

export const API_CONFIG = {
  SHOPEEXTRA: {
    BASE_URL: config.NEXT_PUBLIC_SHOPEEXTRA_PREFIX || "",
    AUTH_ENDPOINT: "/authenticate",
    PRODUCTS_ENDPOINT: "/shopeextra/all",
    CREDENTIALS: {
      key: config.SHOPEEXTRA_API_KEY || "",
      secret: config.SHOPEEXTRA_API_SECRET || "",
    },
  },
} as const;

export const CACHE_CONFIG = {
  TTL: {
    PRODUCTS: 3600,
    AUTH_TOKEN: 3600,
  },
  PREFIXES: {
    PRODUCTS: "products:page:",
    AUTH_TOKEN: "involve-asia-auth-token",
  },
} as const;

export const HTTP_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export type Config = typeof config;
export type ApiConfig = typeof API_CONFIG;
export type CacheConfig = typeof CACHE_CONFIG;
