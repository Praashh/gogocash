import { describe, it, expect, beforeEach, vi, afterAll } from "vitest";
import { getAllData } from "../src/actions/shopeextra/getAll";
import { SecureHttpClient } from "@/lib/http-client";
import { logger } from "@/lib/logger";
import { productDataResponseSchema } from "@/../zod/involve-asia";

// Create mock Redis functions using hoisted to avoid reference errors
const { mockRedisSet, mockRedisGet } = vi.hoisted(() => ({
  mockRedisSet: vi.fn(),
  mockRedisGet: vi.fn(),
}));

// Mock dependencies
vi.mock("@/lib/http-client");
vi.mock("@/lib/logger");
vi.mock("@/lib/config", () => ({
  API_CONFIG: {
    SHOPEEXTRA: {
      BASE_URL: "https://api.example.com",
      PRODUCTS_ENDPOINT: "/shopeextra/all",
    },
  },
  CACHE_CONFIG: {
    TTL: {
      PRODUCTS: 3600,
    },
    PREFIXES: {
      PRODUCTS: "products:page:",
    },
  },
  HTTP_CONFIG: {
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
  },
}));

// Mock RedisSingleton using the hoisted functions
vi.mock("@/lib/redis", () => ({
  RedisSingleton: {
    getInstance: vi.fn(() => ({
      set: mockRedisSet,
      get: mockRedisGet,
    })),
  },
}));

const mockedSecureHttpClient = vi.mocked(SecureHttpClient);
const mockedLogger = vi.mocked(logger);

const originalEnv = process.env;

describe("getAllData", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockClient: any;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SHOPEEXTRA_PREFIX: "https://api.example.com",
      INVOLVE_ASIA_API_TOKEN: "test-token",
    };

    // Setup mock client
    mockClient = {
      setAuthToken: vi.fn(),
      post: vi.fn(),
    };
    mockedSecureHttpClient.mockImplementation(() => mockClient);

    // Reset Redis mocks
    mockRedisSet.mockReset();
    mockRedisGet.mockReset();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should return success response with data when API call succeeds", async () => {
    const mockApiResponse = {
      status: "success",
      message: "Data retrieved successfully",
      data: {
        page: 1,
        limit: 10,
        count: 1,
        nextPage: 2,
        data: [
          {
            shop_id: 123,
            shop_name: "Test Shop",
            shop_type: "retail",
            shop_link: "https://testshop.com",
            shop_image: "https://testshop.com/image.jpg",
            shop_banner: ["https://testshop.com/banner1.jpg"],
            offer_name: "Test Offer",
            country: "US",
            period_start_time: "2024-01-01T00:00:00Z",
            period_end_time: "2024-12-31T23:59:59Z",
            commission_rate: "5%",
            tracking_link: "https://tracking.com/link",
          },
        ],
      },
    };

    mockClient.post.mockResolvedValueOnce({
      success: true,
      data: mockApiResponse,
    });

    mockRedisSet.mockResolvedValueOnce("OK");

    const result = await getAllData(1, "test-token");

    expect(mockedSecureHttpClient).toHaveBeenCalledWith({
      baseURL: "https://api.example.com",
      timeout: 10000,
      retry: {
        maxAttempts: 3,
        delay: 1000,
        backoffMultiplier: 2,
      },
    });

    expect(mockClient.setAuthToken).toHaveBeenCalledWith("test-token");
    expect(mockClient.post).toHaveBeenCalledWith("/shopeextra/all", null);

    expect(result).toEqual({
      status: "success",
      message: "Data fetched successfully",
      data: mockApiResponse.data.data,
    });

    expect(mockRedisSet).toHaveBeenCalledWith(
      "products:page:1",
      JSON.stringify(mockApiResponse.data.data),
      "EX",
      3600,
    );
  });

  it("should return failed response when API call fails", async () => {
    mockClient.post.mockResolvedValueOnce({
      success: false,
      error: "Network error",
      statusCode: 500,
    });

    const result = await getAllData(1, "test-token");

    expect(result).toEqual({
      status: "failed",
      message: "Network error",
      data: [],
    });

    expect(mockedLogger.error).toHaveBeenCalledWith(
      "HTTP request failed for page 1",
      { page: 1, error: "Network error", statusCode: 500 },
    );
  });

  it("should return failed response when API returns invalid data structure", async () => {
    const invalidApiResponse = {
      status: "success",
      message: "Data retrieved successfully",
      data: {
        page: 1,
        limit: 10,
      },
    };

    mockClient.post.mockResolvedValueOnce({
      success: true,
      data: invalidApiResponse,
    });

    const result = await getAllData(1, "test-token");

    expect(result).toEqual({
      status: "failed",
      message: "Failed to fetch data",
      data: [],
    });
  });

  it("should handle exceptions and return failed response", async () => {
    const mockError = new Error("Network timeout");
    mockClient.post.mockRejectedValueOnce(mockError);

    const result = await getAllData(1, "test-token");

    expect(result).toEqual({
      status: "failed",
      message: "Failed to fetch data",
      data: [],
    });

    expect(mockedLogger.error).toHaveBeenCalledWith("ERROR: Network timeout", {
      page: 1,
    });
  });

  it("should validate response data against zod schema", async () => {
    const validApiResponse = {
      status: "success",
      message: "Data retrieved successfully",
      data: {
        page: 1,
        limit: 10,
        count: 0,
        nextPage: 0,
        data: [],
      },
    };

    mockClient.post.mockResolvedValueOnce({
      success: true,
      data: validApiResponse,
    });

    mockRedisSet.mockResolvedValueOnce("OK");

    const result = await getAllData(1, "test-token");

    expect(result.status).toBe("success");
    expect(result.data).toBeDefined();

    expect(() =>
      productDataResponseSchema.parse(validApiResponse),
    ).not.toThrow();
  });

  it("should handle empty data array in response", async () => {
    const emptyDataResponse = {
      status: "success",
      message: "No data found",
      data: {
        page: 1,
        limit: 10,
        count: 0,
        nextPage: 0,
        data: [],
      },
    };

    mockClient.post.mockResolvedValueOnce({
      success: true,
      data: emptyDataResponse,
    });

    mockRedisSet.mockResolvedValueOnce("OK");

    const result = await getAllData(1, "test-token");

    expect(result).toEqual({
      status: "success",
      message: "Data fetched successfully",
      data: [],
    });
  });

  it("should handle non-array product data", async () => {
    const invalidDataResponse = {
      status: "success",
      message: "Data retrieved successfully",
      data: {
        page: 1,
        limit: 10,
        count: 1,
        nextPage: 0,
        data: "not an array", // Invalid: should be array
      },
    };

    mockClient.post.mockResolvedValueOnce({
      success: true,
      data: invalidDataResponse,
    });

    const result = await getAllData(1, "test-token");

    expect(result).toEqual({
      status: "failed",
      message: "Failed to fetch data",
      data: [],
    });

    expect(mockedLogger.error).toHaveBeenCalledWith(
      expect.stringContaining("ERROR:"),
      { page: 1 },
    );
  });
});
