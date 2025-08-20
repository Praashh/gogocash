"use server";

import { SecureHttpClient } from "@/lib/http-client";
import { API_CONFIG, CACHE_CONFIG } from "@/lib/config";
import {
  productDataResponseSchema,
  TProductDataResponse,
  TProductData,
} from "@/../zod/involve-asia";
import { RedisSingleton } from "@/lib/redis";
import { logger } from "@/lib/logger";

const redis = RedisSingleton.getInstance();
export interface GetAllDataResponse {
  status: "success" | "failed";
  message: string;
  data: TProductData[];
}

export async function getAllData(
  page: number,
  token: string,
): Promise<GetAllDataResponse> {
  const cacheKey = CACHE_CONFIG.PREFIXES.PRODUCTS + page;

  try {
    const client = new SecureHttpClient({
      baseURL: API_CONFIG.SHOPEEXTRA.BASE_URL,
      timeout: 10000,
      retry: {
        maxAttempts: 3,
        delay: 1000,
        backoffMultiplier: 2,
      },
    });

    client.setAuthToken(token);

    const response = await client.post<TProductDataResponse>(
      API_CONFIG.SHOPEEXTRA.PRODUCTS_ENDPOINT,
      null,
    );

    if (!response.success || !response.data) {
      logger.error(`HTTP request failed for page ${page}`, {
        page,
        error: response.error,
        statusCode: response.statusCode,
      });

      return {
        status: "failed",
        message: response.error || "Failed to fetch data from API",
        data: [],
      };
    }

    logger.debug(`Raw API response for page ${page}`, {
      page,
      responseKeys: Object.keys(response.data),
      hasData: "data" in response.data,
      dataType: typeof response.data.data,
    });

    const parsedData = productDataResponseSchema.parse(response.data);

    const productData = parsedData.data.data;

    if (!productData || !Array.isArray(productData)) {
      logger.error(`Invalid product data structure for page ${page}`, {
        page,
        productData: typeof productData,
      });

      return {
        status: "failed",
        message: "Invalid data structure received from API",
        data: [],
      };
    }

    await redis.set(
      cacheKey,
      JSON.stringify(productData),
      "EX",
      CACHE_CONFIG.TTL.PRODUCTS,
    );

    logger.info(`Data fetched and cached successfully for page ${page}`, {
      page,
      count: productData.length,
    });

    return {
      status: "success",
      message: "Data fetched successfully",
      data: productData,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    logger.error(`ERROR: ${errorMessage}`, { page });

    return {
      status: "failed",
      message: "Failed to fetch data",
      data: [],
    };
  }
}
