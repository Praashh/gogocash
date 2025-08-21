"use server";

import axios from "axios";
import { logger } from "@/lib/logger";

const URL = process.env.NEXT_PUBLIC_SHOPEEXTRA_PREFIX + "/authenticate";
const GENERAL = process.env.SHOPEEXTRA_API_KEY;
const SECRET = process.env.SHOPEEXTRA_API_SECRET;

export async function getAuthToken(): Promise<{
  success: boolean;
  token: string | null;
}> {
  try {
    const response = await axios.post(URL, {
      key: GENERAL,
      secret: SECRET,
    });

    if (!response.data) {
      return {
        success: false,
        token: null,
      };
    } else {
      return {
        success: true,
        token: response.data.data.token,
      };
    }
  } catch (error) {
    logger.error(`TOKEN_FETCHING_ERROR`, {
      error: error,
    });
    return {
      success: false,
      token: null,
    };
  }
}
