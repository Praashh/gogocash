"use server";
import axios from "axios";
import { productDataResponseSchema } from "@/../zod/involve-asia";

const URL = process.env.NEXT_PUBLIC_SHOPEEXTRA_PREFIX + "/all";
const TOKEN = process.env.INVOLVE_ASIA_API_TOKEN;

export async function getAllData() {
  try {
    const response = await axios.post(URL, null, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    const data = response.data;
    const parsedData = productDataResponseSchema.parse(data);
    return {
      status: "success",
      message: "Data fetched successfully",
      data: parsedData.data,
    };
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return {
      status: "failed",
      message: "Failed to fetch data",
      data: [],
    };
  }
}
