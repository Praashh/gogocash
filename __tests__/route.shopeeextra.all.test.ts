import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import type { TProductData } from "@/../zod/involve-asia";

vi.mock("next/server", () => {
  return {
    NextResponse: {
      json: (body: unknown, init?: ResponseInit) =>
        new Response(JSON.stringify(body), init),
    },
  };
});

// Fix the Redis mock to include RedisSingleton
vi.mock("@/lib/redis", () => {
  const mockRedisInstance = {
    get: vi.fn(),
    set: vi.fn(),
  };

  return {
    redis: mockRedisInstance,
    RedisSingleton: {
      getInstance: vi.fn(() => mockRedisInstance),
    },
  };
});

vi.mock("@/actions/shopeextra/getAll", () => {
  return {
    getAllData: vi.fn(),
  };
});

vi.mock("@/actions/shopeextra/getToken", () => {
  return {
    getAuthToken: vi.fn(),
  };
});

// Mock session to avoid Next.js request-scope dependency in tests
vi.mock("next-auth", () => ({
  getServerSession: vi.fn().mockResolvedValue({
    user: { id: "u1", email: "u1@example.com" },
  }),
}));

// Helpers
const createRequest = (
  page: number | undefined,
): import("next/server").NextRequest => {
  const url = new URL("https://example.com/api/shopeextra/all");
  if (page !== undefined) {
    url.searchParams.set("page", String(page));
  }
  return { nextUrl: url } as unknown as import("next/server").NextRequest;
};

describe("GET /api/shopeextra/all", () => {
  type RouteModule = typeof import("@/app/api/shopeextra/all/route");
  let GET: RouteModule["GET"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let redis: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let getAllData: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let getAuthToken: any;

  beforeAll(async () => {
    ({ redis } = await import("@/lib/redis"));
    ({ getAllData } = await import("@/actions/shopeextra/getAll"));
    ({ getAuthToken } = await import("@/actions/shopeextra/getToken"));
    ({ GET } = await import("@/app/api/shopeextra/all/route"));
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns data from cache when available", async () => {
    const page = 1;
    const cacheKey = `products:page:${page}`;
    const tokenKey = "involve-aisa-auth-token";
    const cachedData = [{ id: 1, name: "Cached Product" }];

    redis.get
      .mockImplementationOnce(async (key: string) => {
        if (key === tokenKey) return "any-token"; // first call: token lookup
        return null;
      })
      .mockImplementationOnce(async (key: string) => {
        if (key === cacheKey) return JSON.stringify(cachedData); // second: cache lookup
        return null;
      });

    const res = await GET(createRequest(page));
    const body = await (res as Response).json();

    expect(res.status).toBe(200);
    expect(body).toEqual({
      success: true,
      productData: cachedData,
      source: "cache",
    });

    expect(redis.set).not.toHaveBeenCalled();
    expect(getAllData).not.toHaveBeenCalled();
    expect(getAuthToken).not.toHaveBeenCalled();
  });

  it("fetches from API when cache miss and token exists", async () => {
    const page = 2;
    const cacheKey = `products:page:${page}`;
    const tokenKey = "involve-aisa-auth-token";
    const token = "existing-token";
    const apiData: TProductData[] = [
      {
        shop_id: 10,
        shop_name: "API Shop",
        shop_type: "retail",
        shop_link: "https://shop.example.com",
        shop_image: "https://shop.example.com/image.jpg",
        shop_banner: ["https://shop.example.com/banner.jpg"],
        offer_name: "Offer",
        country: "US",
        period_start_time: "2024-01-01T00:00:00Z",
        period_end_time: "2024-12-31T23:59:59Z",
        commission_rate: "5%",
        tracking_link: "https://track.example.com",
      },
    ];

    redis.get
      .mockImplementationOnce(async (key: string) => {
        if (key === tokenKey) return token; // first: token from cache
        return null;
      })
      .mockImplementationOnce(async (key: string) => {
        if (key === cacheKey) return null; // second: cache miss
        return null;
      });

    getAllData.mockResolvedValueOnce({
      status: "success",
      message: "ok",
      data: apiData,
    });

    const res = await GET(createRequest(page));
    const body = await (res as Response).json();

    expect(res.status).toBe(200);
    expect(body).toEqual({
      success: true,
      productData: apiData,
      source: "api",
    });

    expect(getAuthToken).not.toHaveBeenCalled();
    expect(getAllData).toHaveBeenCalledWith(page, token);
    expect(redis.set).toHaveBeenCalledWith(tokenKey, token, "EX", 3600);
  });

  it("retrieves token via API when not cached, then fetches data", async () => {
    const page = 3;
    const cacheKey = `products:page:${page}`;
    const tokenKey = "involve-aisa-auth-token";
    const newToken = "newly-fetched-token";
    const apiData: TProductData[] = [
      {
        shop_id: 42,
        shop_name: "Fresh Shop",
        shop_type: "retail",
        shop_link: "https://fresh.example.com",
        shop_image: "https://fresh.example.com/image.jpg",
        shop_banner: ["https://fresh.example.com/banner.jpg"],
        offer_name: "Fresh Offer",
        country: "US",
        period_start_time: "2024-01-01T00:00:00Z",
        period_end_time: "2024-12-31T23:59:59Z",
        commission_rate: "7%",
        tracking_link: "https://track.example.com/fresh",
      },
    ];

    redis.get
      .mockImplementationOnce(async (key: string) => {
        if (key === tokenKey) return null; // first: token not in cache
        return null;
      })
      .mockImplementationOnce(async (key: string) => {
        if (key === cacheKey) return null; // second: cache miss
        return null;
      });

    getAuthToken.mockResolvedValueOnce({
      success: true,
      token: newToken,
    });

    getAllData.mockResolvedValueOnce({
      status: "success",
      message: "ok",
      data: apiData,
    });

    const res = await GET(createRequest(page));
    const body = await (res as Response).json();

    expect(res.status).toBe(200);
    expect(body).toEqual({
      success: true,
      productData: apiData,
      source: "api",
    });

    expect(getAuthToken).toHaveBeenCalled();
    expect(getAllData).toHaveBeenCalledWith(page, newToken);
    expect(redis.set).toHaveBeenCalledWith(tokenKey, newToken, "EX", 3600);
  });

  it("returns 500 when an error occurs", async () => {
    const page = 4;
    const cacheKey = `products:page:${page}`;
    const tokenKey = "involve-aisa-auth-token";

    redis.get
      .mockImplementationOnce(async (key: string) => {
        if (key === tokenKey) return "t"; // first: token in cache
        return null;
      })
      .mockImplementationOnce(async (key: string) => {
        if (key === cacheKey) return null; // second: cache miss
        return null;
      });

    getAllData.mockRejectedValueOnce(new Error("boom"));

    const res = await GET(createRequest(page));
    const body = await (res as Response).json();

    expect(res.status).toBe(500);
    expect(body).toEqual({
      success: false,
      productData: [],
      error: "Failed to fetch data",
    });
  });
});
