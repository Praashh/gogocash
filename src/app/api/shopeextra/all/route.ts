import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { getAllData } from "@/actions/shopeextra/getAll";
import { getAuthToken } from "@/actions/shopeextra/getToken";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");

  const cacheKey = `products:page:${page}`;
  const tokenKey = "involve-aisa-auth-token";
  let token = await redis.get(tokenKey);

  try {
    console.time("REDIS_DATA_FETCHING");
    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log(`Cache hit for page ${page}`);
      console.timeEnd("REDIS_DATA_FETCHING");
      return NextResponse.json({
        success: true,
        productData: JSON.parse(cached),
        source: "cache",
      });
    }

    console.log(`No Cache found for page ${page}`);
    console.timeEnd("REDIS_DATA_FETCHING");

    if (!token) {
      console.log("NO CACHE HIT FOR TOKEN");
      const newTokenResponse = await getAuthToken();
      if (newTokenResponse.token !== null) {
        console.log("TOKEN FETCHING FROM API", newTokenResponse.success);
        token = newTokenResponse.token;
      }
    }
    await redis.set(tokenKey, token!, "EX", 3600);
    const response = await getAllData(page, token!);

    return NextResponse.json({
      success: true,
      productData: response.data,
      source: "api",
    });
  } catch (error) {
    console.error(`ERROR: ${error}`);
    return NextResponse.json(
      {
        success: false,
        productData: [],
        error: "Failed to fetch data",
      },
      { status: 500 },
    );
  }
}
